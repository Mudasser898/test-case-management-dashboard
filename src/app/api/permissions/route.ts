import { NextRequest, NextResponse } from 'next/server';
import type { Permission, User } from '@/types';

// Mock users data
const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: undefined,
  },
  {
    id: 'user-2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: undefined,
  },
];

// Mock permissions data
let mockPermissions: Permission[] = [
  {
    id: 'perm-1',
    userId: 'user-1',
    user: mockUsers[0],
    role: 'owner',
    invitedAt: new Date('2024-01-01'),
    acceptedAt: new Date('2024-01-01'),
    status: 'accepted',
  },
];

export async function GET() {
  return NextResponse.json(mockPermissions);
}

export async function POST(request: NextRequest) {
  try {
    const { invitations } = await request.json();
    
    const newPermissions: Permission[] = invitations.map((invitation: any) => {
      // Check if user already exists
      let user = mockUsers.find(u => u.email === invitation.email);
      
      // Create new user if doesn't exist
      if (!user) {
        user = {
          id: `user-${Date.now()}-${Math.random()}`,
          name: invitation.email.split('@')[0],
          email: invitation.email,
        };
        mockUsers.push(user);
      }
      
      const permission: Permission = {
        id: `perm-${Date.now()}-${Math.random()}`,
        userId: user.id,
        user,
        role: invitation.role,
        invitedAt: new Date(),
        status: 'pending',
      };
      
      return permission;
    });
    
    mockPermissions.push(...newPermissions);
    
    // Simulate sending emails
    console.log('Sending invitation emails to:', invitations.map((i: any) => i.email));
    
    return NextResponse.json(newPermissions, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send invitations' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { permissionId, role } = await request.json();
    
    const permissionIndex = mockPermissions.findIndex(p => p.id === permissionId);
    if (permissionIndex === -1) {
      return NextResponse.json({ error: 'Permission not found' }, { status: 404 });
    }
    
    mockPermissions[permissionIndex] = {
      ...mockPermissions[permissionIndex],
      role: role as any,
    };
    
    return NextResponse.json(mockPermissions[permissionIndex]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update permission' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const permissionId = searchParams.get('id');
    
    if (!permissionId) {
      return NextResponse.json({ error: 'Permission ID required' }, { status: 400 });
    }
    
    const index = mockPermissions.findIndex(p => p.id === permissionId);
    if (index === -1) {
      return NextResponse.json({ error: 'Permission not found' }, { status: 404 });
    }
    
    mockPermissions.splice(index, 1);
    
    return NextResponse.json({ message: 'Permission removed successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to remove permission' }, { status: 500 });
  }
}