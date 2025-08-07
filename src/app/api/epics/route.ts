import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const epics = await prisma.epic.findMany({
      where: { 
        deletedAt: null,
        userId 
      },
      include: {
        _count: {
          select: {
            testCases: {
              where: {
                deletedAt: null,
                ...(userId ? { userId } : {})
              }
            }
          }
        },
        testCases: {
          where: {
            deletedAt: null,
            status: 'PASSED',
            ...(userId ? { userId } : {})
          },
          select: { id: true }
        }
      },
      orderBy: { name: 'asc' }
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