"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { MoreHorizontal, Edit, Trash2, ChevronDown, ChevronUp, Save, FileText, Camera } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TestCaseComments } from "./test-case-comments";
import { useUser } from "@/contexts/user-context";
import type { TestCase, Comment } from "@/types";

interface TestCaseCardProps {
  testCase: TestCase;
  isExpanded: boolean;
  onEdit: (testCase: TestCase) => void;
  onDelete: (id: string) => void;
  onUpdate: (testCase: TestCase) => void;
  onToggleExpand: (testCaseId: string) => void;
}

export function TestCaseCard({ testCase, isExpanded, onEdit, onDelete, onUpdate, onToggleExpand }: TestCaseCardProps) {
  const [notes, setNotes] = useState(testCase.notes || '');
  const [evidence, setEvidence] = useState(testCase.evidence || '');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  
  const { currentUser, canEdit, canComment } = useUser();

  // Sync local state when testCase changes
  useEffect(() => {
    setNotes(testCase.notes || '');
    setEvidence(testCase.evidence || '');
    setHasUnsavedChanges(false);
  }, [testCase.notes, testCase.evidence]);

  // Fetch comments when expanded
  useEffect(() => {
    if (isExpanded) {
      fetchComments();
    }
  }, [isExpanded, testCase.id]);

  const fetchComments = async () => {
    setCommentsLoading(true);
    try {
      const response = await fetch(`/api/comments?testCaseId=${testCase.id}`);
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setCommentsLoading(false);
    }
  };

  const getStatusColor = (status: TestCase['status']) => {
    switch (status) {
      case 'Passed':
        return 'bg-green-500';
      case 'Failed':
        return 'bg-red-500';
      case 'Not Run':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusBadgeVariant = (status: TestCase['status']) => {
    switch (status) {
      case 'Passed':
        return 'default';
      case 'Failed':
        return 'destructive';
      case 'Not Run':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const handleNotesChange = (value: string) => {
    setNotes(value);
    setHasUnsavedChanges(value !== testCase.notes || evidence !== testCase.evidence);
  };

  const handleEvidenceChange = (value: string) => {
    setEvidence(value);
    setHasUnsavedChanges(notes !== testCase.notes || value !== testCase.evidence);
  };

  const handleSave = async () => {
    const updatedTestCase = {
      ...testCase,
      notes,
      evidence,
    };
    await onUpdate(updatedTestCase);
    setHasUnsavedChanges(false);
  };

  const handleAddComment = async (testCaseId: string, content: string) => {
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ testCaseId, content }),
      });
      
      if (response.ok) {
        fetchComments();
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleEditComment = async (commentId: string, content: string) => {
    try {
      const response = await fetch('/api/comments', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ commentId, content }),
      });
      
      if (response.ok) {
        fetchComments();
      }
    } catch (error) {
      console.error('Failed to edit comment:', error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const response = await fetch(`/api/comments?id=${commentId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        fetchComments();
      }
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't expand if clicking on buttons or interactive elements
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('[role="button"]')) {
      return;
    }
    onToggleExpand(testCase.id);
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 bg-card border-border">
      <div onClick={handleCardClick} className="cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs font-mono">
                  {testCase.id}
                </Badge>
                <Badge 
                  variant={getStatusBadgeVariant(testCase.status)}
                  className="text-xs"
                >
                  {testCase.status}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleExpand(testCase.id);
                }}
              >
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
              {canEdit && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(testCase)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDelete(testCase.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
            {testCase.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
            {testCase.description}
          </p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Epic: {testCase.epic}</span>
            <span>{new Date(testCase.createdAt).toLocaleDateString()}</span>
          </div>
        </CardContent>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div onClick={(e) => e.stopPropagation()}>
          <Separator />
          <CardContent className="pt-4 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <FileText className="h-4 w-4" />
                Notes
              </div>
              <Textarea
                placeholder="Add notes for this test case..."
                value={notes}
                onChange={(e) => handleNotesChange(e.target.value)}
                rows={3}
                className="resize-none"
                disabled={!canEdit}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Camera className="h-4 w-4" />
                Evidence
              </div>
              <Textarea
                placeholder="Add evidence and documentation..."
                value={evidence}
                onChange={(e) => handleEvidenceChange(e.target.value)}
                rows={4}
                className="resize-none"
                disabled={!canEdit}
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-muted-foreground">
                Expected Result: {testCase.expectedResult}
              </div>
              {hasUnsavedChanges && (
                <Button
                  size="sm"
                  onClick={handleSave}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
              )}
            </div>

            {/* Comments Section */}
            <Separator className="my-4" />
            {currentUser && (
              <TestCaseComments
                testCaseId={testCase.id}
                comments={comments}
                currentUser={currentUser}
                canComment={canComment}
                onAddComment={handleAddComment}
                onEditComment={handleEditComment}
                onDeleteComment={handleDeleteComment}
              />
            )}
          </CardContent>
        </div>
      )}
    </Card>
  );
}