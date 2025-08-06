import { NextRequest, NextResponse } from 'next/server';
import { prisma, createAuditLog } from '@/lib/db';
import type { TestCase } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const epicId = searchParams.get('epic');
    const search = searchParams.get('search');
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    // Build where clause
    const where: any = {
      userId,
      isDeleted: false,
    };

    // Filter by status
    if (status && status !== 'all') {
      const statusMap = {
        'passed': 'PASSED',
        'failed': 'FAILED',
        'not-run': 'NOT_RUN'
      };
      where.status = statusMap[status as keyof typeof statusMap];
    }

    // Filter by epic
    if (epicId) {
      where.epicId = epicId;
    }

    // Filter by search term
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { id: { contains: search, mode: 'insensitive' } }
      ];
    }

    const testCases = await prisma.testCase.findMany({
      where,
      include: {
        epic: true,
        user: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Transform data to match frontend expectations
    const transformedTestCases = testCases.map(tc => ({
      id: tc.id,
      userId: tc.userId,
      application: tc.application,
      module: tc.module,
      testType: tc.testType,
      testScenarioId: tc.testScenarioId,
      testScenario: tc.testScenario,
      epic: tc.epic.name,
      title: tc.title,
      description: tc.description,
      detailedSteps: JSON.parse(tc.detailedSteps || '[]'),
      expectedResult: tc.expectedResult,
      actualBehavior: tc.actualBehavior || '',
      status: tc.status === 'PASSED' ? 'Passed' : tc.status === 'FAILED' ? 'Failed' : 'Not Run',
      notes: tc.notes || '',
      evidence: tc.evidence || '',
      createdAt: tc.createdAt,
      updatedAt: tc.updatedAt
    }));

    return NextResponse.json(transformedTestCases);
  } catch (error) {
    console.error('Failed to fetch test cases:', error);
    return NextResponse.json({ error: 'Failed to fetch test cases' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const testCaseData = await request.json();
    
    if (!testCaseData.userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    // Find or create epic
    let epic = await prisma.epic.findFirst({
      where: { name: testCaseData.epic }
    });

    if (!epic) {
      epic = await prisma.epic.create({
        data: {
          name: testCaseData.epic,
          description: `${testCaseData.epic} test cases`
        }
      });
    }

    // Create test case
    const newTestCase = await prisma.testCase.create({
      data: {
        userId: testCaseData.userId,
        epicId: epic.id,
        application: testCaseData.application || 'Test Application',
        module: testCaseData.module || 'General',
        testType: testCaseData.testType || 'FUNCTIONAL',
        testScenarioId: testCaseData.testScenarioId || `TS_${Date.now()}`,
        testScenario: testCaseData.testScenario || testCaseData.title,
        title: testCaseData.title,
        description: testCaseData.description,
        detailedSteps: JSON.stringify(testCaseData.detailedSteps || [testCaseData.description]),
        expectedResult: testCaseData.expectedResult,
        actualBehavior: testCaseData.actualBehavior || '',
        status: testCaseData.status === 'Passed' ? 'PASSED' : 
               testCaseData.status === 'Failed' ? 'FAILED' : 'NOT_RUN',
        notes: testCaseData.notes || '',
        evidence: testCaseData.evidence || '',
        tags: JSON.stringify([])
      },
      include: {
        epic: true,
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    // Create audit log
    await createAuditLog({
      userId: testCaseData.userId,
      testCaseId: newTestCase.id,
      action: 'CREATE',
      entity: 'TestCase',
      entityId: newTestCase.id,
      newValues: newTestCase,
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown'
    });

    // Transform response to match frontend expectations
    const transformedTestCase = {
      id: newTestCase.id,
      userId: newTestCase.userId,
      application: newTestCase.application,
      module: newTestCase.module,
      testType: newTestCase.testType,
      testScenarioId: newTestCase.testScenarioId,
      testScenario: newTestCase.testScenario,
      epic: newTestCase.epic.name,
      title: newTestCase.title,
      description: newTestCase.description,
      detailedSteps: JSON.parse(newTestCase.detailedSteps),
      expectedResult: newTestCase.expectedResult,
      actualBehavior: newTestCase.actualBehavior || '',
      status: newTestCase.status === 'PASSED' ? 'Passed' : 
             newTestCase.status === 'FAILED' ? 'Failed' : 'Not Run',
      notes: newTestCase.notes || '',
      evidence: newTestCase.evidence || '',
      createdAt: newTestCase.createdAt,
      updatedAt: newTestCase.updatedAt
    };
    
    return NextResponse.json(transformedTestCase, { status: 201 });
  } catch (error) {
    console.error('Failed to create test case:', error);
    return NextResponse.json({ error: 'Failed to create test case' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, userId, ...updateData } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    // Get existing test case
    const existingTestCase = await prisma.testCase.findFirst({
      where: { id, userId, isDeleted: false }
    });

    if (!existingTestCase) {
      return NextResponse.json({ error: 'Test case not found or access denied' }, { status: 404 });
    }

    // Find epic if provided
    let epicId = existingTestCase.epicId;
    if (updateData.epic) {
      let epic = await prisma.epic.findFirst({
        where: { name: updateData.epic }
      });

      if (!epic) {
        epic = await prisma.epic.create({
          data: {
            name: updateData.epic,
            description: `${updateData.epic} test cases`
          }
        });
      }
      epicId = epic.id;
    }

    // Update test case
    const updatedTestCase = await prisma.testCase.update({
      where: { id },
      data: {
        epicId,
        application: updateData.application || existingTestCase.application,
        module: updateData.module || existingTestCase.module,
        testType: updateData.testType || existingTestCase.testType,
        testScenarioId: updateData.testScenarioId || existingTestCase.testScenarioId,
        testScenario: updateData.testScenario || existingTestCase.testScenario,
        title: updateData.title || existingTestCase.title,
        description: updateData.description || existingTestCase.description,
        detailedSteps: updateData.detailedSteps ? 
          JSON.stringify(updateData.detailedSteps) : 
          existingTestCase.detailedSteps,
        expectedResult: updateData.expectedResult || existingTestCase.expectedResult,
        actualBehavior: updateData.actualBehavior !== undefined ? 
          updateData.actualBehavior : 
          existingTestCase.actualBehavior,
        status: updateData.status ? 
          (updateData.status === 'Passed' ? 'PASSED' : 
           updateData.status === 'Failed' ? 'FAILED' : 'NOT_RUN') :
          existingTestCase.status,
        notes: updateData.notes !== undefined ? updateData.notes : existingTestCase.notes,
        evidence: updateData.evidence !== undefined ? updateData.evidence : existingTestCase.evidence,
      },
      include: {
        epic: true,
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    // Create audit log
    await createAuditLog({
      userId,
      testCaseId: id,
      action: 'UPDATE',
      entity: 'TestCase',
      entityId: id,
      oldValues: existingTestCase,
      newValues: updatedTestCase,
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown'
    });

    // Transform response
    const transformedTestCase = {
      id: updatedTestCase.id,
      userId: updatedTestCase.userId,
      application: updatedTestCase.application,
      module: updatedTestCase.module,
      testType: updatedTestCase.testType,
      testScenarioId: updatedTestCase.testScenarioId,
      testScenario: updatedTestCase.testScenario,
      epic: updatedTestCase.epic.name,
      title: updatedTestCase.title,
      description: updatedTestCase.description,
      detailedSteps: JSON.parse(updatedTestCase.detailedSteps),
      expectedResult: updatedTestCase.expectedResult,
      actualBehavior: updatedTestCase.actualBehavior || '',
      status: updatedTestCase.status === 'PASSED' ? 'Passed' : 
             updatedTestCase.status === 'FAILED' ? 'Failed' : 'Not Run',
      notes: updatedTestCase.notes || '',
      evidence: updatedTestCase.evidence || '',
      createdAt: updatedTestCase.createdAt,
      updatedAt: updatedTestCase.updatedAt
    };

    return NextResponse.json(transformedTestCase);
  } catch (error) {
    console.error('Failed to update test case:', error);
    return NextResponse.json({ error: 'Failed to update test case' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');
    
    if (!id || !userId) {
      return NextResponse.json({ error: 'Test case ID and userId are required' }, { status: 400 });
    }

    // Get existing test case
    const existingTestCase = await prisma.testCase.findFirst({
      where: { id, userId, isDeleted: false }
    });

    if (!existingTestCase) {
      return NextResponse.json({ error: 'Test case not found or access denied' }, { status: 404 });
    }

    // Soft delete the test case
    const deletedTestCase = await prisma.testCase.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: userId
      }
    });

    // Create audit log
    await createAuditLog({
      userId,
      testCaseId: id,
      action: 'DELETE',
      entity: 'TestCase',
      entityId: id,
      oldValues: existingTestCase,
      newValues: { isDeleted: true, deletedAt: deletedTestCase.deletedAt },
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown'
    });
    
    return NextResponse.json({ message: 'Test case deleted successfully' });
  } catch (error) {
    console.error('Failed to delete test case:', error);
    return NextResponse.json({ error: 'Failed to delete test case' }, { status: 500 });
  }
}