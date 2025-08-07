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
  action,
  entity,
  entityId,
  oldValues,
  newValues,
  ipAddress,
  userAgent,
}: {
  userId: string
  action: string
  entity: string
  entityId: string
  oldValues?: Record<string, unknown>
  newValues?: Record<string, unknown>
  ipAddress?: string
  userAgent?: string
}) {
  if (!userId) return;
  
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action: action as 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'PERMISSION_GRANT' | 'PERMISSION_REVOKE',
        tableName: entity,
        recordId: entityId,
        oldValues: oldValues ? JSON.stringify(oldValues) : null,
        newValues: newValues ? JSON.stringify(newValues) : null,
        metadata: ipAddress || userAgent ? JSON.stringify({ ipAddress, userAgent }) : null,
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
  console.log('Database initialization skipped - data will be created as needed');
}

export default prisma