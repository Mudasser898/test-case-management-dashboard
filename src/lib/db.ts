import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Audit logging utility
export async function createAuditLog({
  userId,
  testCaseId,
  action,
  entity,
  entityId,
  oldValues,
  newValues,
  ipAddress,
  userAgent,
}: {
  userId?: string
  testCaseId?: string
  action: string
  entity: string
  entityId: string
  oldValues?: any
  newValues?: any
  ipAddress?: string
  userAgent?: string
}) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        testCaseId,
        action: action as any,
        entity,
        entityId,
        oldValues: oldValues ? JSON.stringify(oldValues) : null,
        newValues: newValues ? JSON.stringify(newValues) : null,
        ipAddress,
        userAgent,
      },
    })
  } catch (error) {
    console.error('Failed to create audit log:', error)
  }
}

// Database initialization with seed data
export async function createDefaultUserAccount() {
  try {
    // Check if default admin user exists
    const existingUser = await prisma.user.findFirst({
      where: { email: 'admin@testdashboard.app' }
    });

    if (!existingUser) {
      // Create default admin user
      const defaultUser = await prisma.user.create({
        data: {
          id: 'admin-user-001',
          email: 'admin@testdashboard.app',
          name: 'Test Dashboard Admin',
          isGuest: false,
          emailVerified: new Date()
        }
      });

      console.log('✅ Created default admin user:', defaultUser.email);
      return defaultUser;
    }

    return existingUser;
  } catch (error) {
    console.error('Failed to create default user account:', error);
    throw error;
  }
}

export async function initializeDatabase() {
  try {
    // Create default epics
    const defaultEpics = [
      { name: 'Authentication', description: 'User authentication and authorization features', color: '#10B981' },
      { name: 'User Management', description: 'User profile and account management', color: '#3B82F6' },
      { name: 'Dashboard', description: 'Main dashboard functionality', color: '#8B5CF6' },
      { name: 'Settings', description: 'Application configuration and settings', color: '#F59E0B' },
      { name: 'API Integration', description: 'External API integrations', color: '#EF4444' },
    ]

    for (const epic of defaultEpics) {
      await prisma.epic.upsert({
        where: { name: epic.name },
        update: {},
        create: epic,
      })
    }

    // Create default test case templates
    const defaultTemplates = [
      {
        name: 'Login Functionality',
        description: 'Standard login test cases for web applications',
        application: 'Web Application',
        module: 'Authentication',
        testType: 'FUNCTIONAL',
        category: 'Authentication',
        sampleTestCases: JSON.stringify([
          {
            title: 'Valid Login',
            description: 'User can login with valid credentials',
            steps: ['Navigate to login page', 'Enter valid username', 'Enter valid password', 'Click login'],
            expectedResult: 'User is logged in successfully'
          },
          {
            title: 'Invalid Login',
            description: 'Error shown for invalid credentials',
            steps: ['Navigate to login page', 'Enter invalid username', 'Enter invalid password', 'Click login'],
            expectedResult: 'Error message is displayed'
          }
        ])
      },
      {
        name: 'User Registration',
        description: 'User registration flow test cases',
        application: 'Web Application',
        module: 'Authentication',
        testType: 'FUNCTIONAL',
        category: 'Authentication',
        sampleTestCases: JSON.stringify([
          {
            title: 'Successful Registration',
            description: 'User can register with valid information',
            steps: ['Navigate to registration page', 'Fill all required fields', 'Submit form'],
            expectedResult: 'User account is created and confirmation is shown'
          }
        ])
      }
    ]

    for (const template of defaultTemplates) {
      await prisma.testCaseTemplate.upsert({
        where: { name: template.name },
        update: {},
        create: template,
      })
    }

    console.log('Database initialized with default data')
  } catch (error) {
    console.error('Failed to initialize database:', error)
  }
}

export default prisma