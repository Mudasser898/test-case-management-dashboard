import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import type { Epic } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const epics = await prisma.epic.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: {
            testCases: {
              where: {
                isDeleted: false,
                ...(userId ? { userId } : {})
              }
            }
          }
        },
        testCases: {
          where: {
            isDeleted: false,
            status: 'PASSED',
            ...(userId ? { userId } : {})
          },
          select: { id: true }
        }
      },
      orderBy: { order: 'asc' }
    });

    const transformedEpics = epics.map(epic => ({
      id: epic.id,
      name: epic.name,
      passed: epic.testCases.length,
      total: epic._count.testCases
    }));

    return NextResponse.json(transformedEpics);
  } catch (error) {
    console.error('Failed to fetch epics:', error);
    return NextResponse.json({ error: 'Failed to fetch epics' }, { status: 500 });
  }
}