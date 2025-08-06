import { NextResponse } from 'next/server';
import { prisma, initializeDatabase, createDefaultUserAccount } from '@/lib/db';

export async function POST() {
  try {
    // Initialize database with default data
    await initializeDatabase();
    
    // Create default user account
    const defaultUser = await createDefaultUserAccount();
    
    return NextResponse.json({ 
      message: 'Database initialized successfully',
      defaultUser: {
        email: defaultUser.email,
        name: defaultUser.name,
        id: defaultUser.id
      }
    });
  } catch (error) {
    console.error('Failed to initialize database:', error);
    return NextResponse.json({ error: 'Failed to initialize database' }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Check if database needs initialization
    const epicCount = await prisma.epic.count();
    const templateCount = await prisma.testCaseTemplate.count();
    
    const needsInit = epicCount === 0 || templateCount === 0;
    
    if (needsInit) {
      await initializeDatabase();
    }
    
    return NextResponse.json({ 
      initialized: true, 
      epics: epicCount,
      templates: templateCount,
      needed_init: needsInit
    });
  } catch (error) {
    console.error('Failed to check database status:', error);
    return NextResponse.json({ error: 'Failed to check database status' }, { status: 500 });
  }
}