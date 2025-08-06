import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { createAuditLog } from '@/lib/db';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { testCases, userId } = await request.json();

    if (!testCases || !Array.isArray(testCases) || !userId) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    const results = {
      created: 0,
      updated: 0,
      errors: [] as string[]
    };

    // Process each test case
    for (const testCaseData of testCases) {
      try {
        // Check if test case with this ID already exists for this user
        const existingTestCase = await prisma.testCase.findFirst({
          where: {
            testScenarioId: testCaseData.testScenarioId,
            userId: userId,
            deletedAt: null
          }
        });

        // Find or create epic
        let epic = await prisma.epic.findFirst({
          where: {
            name: testCaseData.epic,
            userId: userId
          }
        });

        if (!epic) {
          epic = await prisma.epic.create({
            data: {
              name: testCaseData.epic,
              userId: userId,
              description: `Epic for ${testCaseData.epic}`,
              passed: 0,
              total: 0
            }
          });
        }

        if (existingTestCase) {
          // Update existing test case
          await prisma.testCase.update({
            where: { id: existingTestCase.id },
            data: {
              ...testCaseData,
              detailedSteps: JSON.stringify(testCaseData.detailedSteps || []),
              tags: JSON.stringify([]),
              epicId: epic.id
            }
          });

          // Create audit log
          await createAuditLog(
            'UPDATE',
            'TestCase',
            existingTestCase.id,
            userId,
            JSON.stringify({}),
            JSON.stringify(testCaseData),
            `Bulk updated test case ${testCaseData.testScenarioId}`
          );

          results.updated++;
        } else {
          // Create new test case
          const newTestCase = await prisma.testCase.create({
            data: {
              ...testCaseData,
              userId,
              epicId: epic.id,
              detailedSteps: JSON.stringify(testCaseData.detailedSteps || []),
              tags: JSON.stringify([])
            }
          });

          // Create audit log
          await createAuditLog(
            'CREATE',
            'TestCase',
            newTestCase.id,
            userId,
            JSON.stringify({}),
            JSON.stringify(testCaseData),
            `Bulk created test case ${testCaseData.testScenarioId}`
          );

          results.created++;
        }

        // Update epic counts
        const epicTestCases = await prisma.testCase.findMany({
          where: {
            epicId: epic.id,
            deletedAt: null
          }
        });

        const passed = epicTestCases.filter(tc => tc.status === 'Passed').length;
        const total = epicTestCases.length;

        await prisma.epic.update({
          where: { id: epic.id },
          data: { passed, total }
        });

      } catch (error) {
        console.error(`Error processing test case ${testCaseData.testScenarioId}:`, error);
        results.errors.push(`Failed to process test case ${testCaseData.testScenarioId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('Bulk operation error:', error);
    return NextResponse.json(
      { error: 'Failed to process bulk operation' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get all test cases for the user
    const testCases = await prisma.testCase.findMany({
      where: {
        userId: userId,
        deletedAt: null
      },
      include: {
        epic: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Format for CSV export
    const csvData = testCases.map(tc => ({
      Epic: tc.epic?.name || tc.epic,
      ID: tc.testScenarioId,
      Description: tc.description,
      'Expected Result': tc.expectedResult,
      Status: tc.status,
      Notes: tc.notes || '',
      Evidence: tc.evidence || '',
      Application: tc.application,
      Module: tc.module,
      'Test Type': tc.testType,
      'Actual Behavior': tc.actualBehavior || '',
      'Created Date': tc.createdAt.toISOString().split('T')[0]
    }));

    return NextResponse.json(csvData);
  } catch (error) {
    console.error('Bulk export error:', error);
    return NextResponse.json(
      { error: 'Failed to export test cases' },
      { status: 500 }
    );
  }
}