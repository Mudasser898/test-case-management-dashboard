import { NextRequest, NextResponse } from 'next/server';
import type { Comment, User } from '@/types';

// Mock current user (in a real app, this would come from authentication)
const currentUser: User = {
  id: 'user-1',
  name: 'John Doe',
  email: 'john@example.com',
};

// Mock comments data
const mockComments: Comment[] = [
  {
    id: 'comment-1',
    testCaseId: 'TC1.1',
    userId: 'user-1',
    user: currentUser,
    content: 'This test case looks good. I verified the repository menu is accessible.',
    createdAt: new Date('2024-01-16T10:30:00'),
    updatedAt: new Date('2024-01-16T10:30:00'),
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const testCaseId = searchParams.get('testCaseId');
  
  if (testCaseId) {
    const testCaseComments = mockComments.filter(c => c.testCaseId === testCaseId);
    return NextResponse.json(testCaseComments);
  }
  
  return NextResponse.json(mockComments);
}

export async function POST(request: NextRequest) {
  try {
    const { testCaseId, content } = await request.json();
    
    const newComment: Comment = {
      id: `comment-${Date.now()}-${Math.random()}`,
      testCaseId,
      userId: currentUser.id,
      user: currentUser,
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    mockComments.push(newComment);
    
    return NextResponse.json(newComment, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { commentId, content } = await request.json();
    
    const commentIndex = mockComments.findIndex(c => c.id === commentId);
    if (commentIndex === -1) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }
    
    // Check if user owns the comment
    if (mockComments[commentIndex].userId !== currentUser.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    mockComments[commentIndex] = {
      ...mockComments[commentIndex],
      content,
      updatedAt: new Date(),
    };
    
    return NextResponse.json(mockComments[commentIndex]);
  } catch {
    return NextResponse.json({ error: 'Failed to update comment' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get('id');
    
    if (!commentId) {
      return NextResponse.json({ error: 'Comment ID required' }, { status: 400 });
    }
    
    const commentIndex = mockComments.findIndex(c => c.id === commentId);
    if (commentIndex === -1) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }
    
    // Check if user owns the comment
    if (mockComments[commentIndex].userId !== currentUser.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    mockComments.splice(commentIndex, 1);
    
    return NextResponse.json({ message: 'Comment deleted successfully' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
  }
}