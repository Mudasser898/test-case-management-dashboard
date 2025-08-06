"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MessageSquare, Send, MoreHorizontal, Edit3, Trash2 } from "lucide-react";
import type { Comment, User } from "@/types";

interface TestCaseCommentsProps {
  testCaseId: string;
  comments: Comment[];
  currentUser: User;
  canComment: boolean;
  onAddComment: (testCaseId: string, content: string) => void;
  onEditComment: (commentId: string, content: string) => void;
  onDeleteComment: (commentId: string) => void;
}

export function TestCaseComments({
  testCaseId,
  comments,
  currentUser,
  canComment,
  onAddComment,
  onEditComment,
  onDeleteComment,
}: TestCaseCommentsProps) {
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      onAddComment(testCaseId, newComment.trim());
      setNewComment("");
    }
  };

  const handleStartEdit = (comment: Comment) => {
    setEditingComment(comment.id);
    setEditContent(comment.content);
  };

  const handleSaveEdit = () => {
    if (editingComment && editContent.trim()) {
      onEditComment(editingComment, editContent.trim());
      setEditingComment(null);
      setEditContent("");
    }
  };

  const handleCancelEdit = () => {
    setEditingComment(null);
    setEditContent("");
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <MessageSquare className="h-4 w-4" />
        Comments ({comments.length})
      </div>

      {/* Add Comment */}
      {canComment && (
        <div className="space-y-3 p-3 border rounded-lg bg-muted/30">
          <div className="flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={currentUser.avatar} />
              <AvatarFallback>
                {currentUser.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                className="resize-none"
              />
              <div className="flex justify-end gap-2">
                <Button
                  size="sm"
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim()}
                  className="gap-2"
                >
                  <Send className="h-4 w-4" />
                  Comment
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No comments yet</p>
            {canComment && <p className="text-sm">Be the first to add a comment!</p>}
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="space-y-3">
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={comment.user.avatar} />
                  <AvatarFallback>
                    {comment.user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{comment.user.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(comment.createdAt)}
                      </span>
                      {comment.createdAt !== comment.updatedAt && (
                        <Badge variant="outline" className="text-xs">
                          edited
                        </Badge>
                      )}
                    </div>
                    {comment.userId === currentUser.id && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleStartEdit(comment)}>
                            <Edit3 className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onDeleteComment(comment.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                  
                  {editingComment === comment.id ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={3}
                        className="resize-none"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleSaveEdit}>
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-foreground whitespace-pre-wrap bg-background p-3 rounded border">
                      {comment.content}
                    </div>
                  )}
                </div>
              </div>
              <Separator />
            </div>
          ))
        )}
      </div>
    </div>
  );
}