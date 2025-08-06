"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Share2,
  Mail,
  Copy,
  Check,
  UserPlus,
  Crown,
  Edit3,
  Eye,
  MessageSquare,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Permission, ShareInvitation } from "@/types";

interface ShareDashboardModalProps {
  permissions: Permission[];
  onInviteUsers: (invitations: ShareInvitation[]) => void;
  onUpdatePermission: (permissionId: string, role: string) => void;
  onRemovePermission: (permissionId: string) => void;
}

export function ShareDashboardModal({
  permissions,
  onInviteUsers,
  onUpdatePermission,
  onRemovePermission,
}: ShareDashboardModalProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"editor" | "viewer" | "commentor">("viewer");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [emails, setEmails] = useState<string[]>([]);

  const dashboardUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleAddEmail = () => {
    if (email && !emails.includes(email)) {
      setEmails([...emails, email]);
      setEmail("");
    }
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setEmails(emails.filter(e => e !== emailToRemove));
  };

  const handleSendInvitations = () => {
    if (emails.length > 0) {
      const invitations: ShareInvitation[] = emails.map(email => ({
        email,
        role,
        message: message || undefined,
      }));
      onInviteUsers(invitations);
      setEmails([]);
      setEmail("");
      setMessage("");
      setOpen(false);
    }
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(dashboardUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case 'editor':
        return <Edit3 className="h-4 w-4 text-blue-500" />;
      case 'viewer':
        return <Eye className="h-4 w-4 text-green-500" />;
      case 'commentor':
        return <MessageSquare className="h-4 w-4 text-purple-500" />;
      default:
        return <Eye className="h-4 w-4" />;
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'owner':
        return 'Full access and management';
      case 'editor':
        return 'Can edit test cases and add new ones';
      case 'viewer':
        return 'Can view all content, read-only access';
      case 'commentor':
        return 'Can view and add comments to test cases';
      default:
        return '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Dashboard
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Copy Link Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Share with link</h3>
            <div className="flex gap-2">
              <Input value={dashboardUrl} readOnly className="flex-1" />
              <Button onClick={handleCopyLink} variant="outline" className="gap-2">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>

          <Separator />

          {/* Invite People Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Invite people
            </h3>

            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddEmail()}
                  className="flex-1"
                />
                <Select value={role} onValueChange={(value: any) => setRole(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viewer">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-green-500" />
                        Viewer
                      </div>
                    </SelectItem>
                    <SelectItem value="commentor">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-purple-500" />
                        Commentor
                      </div>
                    </SelectItem>
                    <SelectItem value="editor">
                      <div className="flex items-center gap-2">
                        <Edit3 className="h-4 w-4 text-blue-500" />
                        Editor
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleAddEmail} disabled={!email}>
                  Add
                </Button>
              </div>

              {/* Email Tags */}
              {emails.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {emails.map((emailAddr) => (
                    <Badge key={emailAddr} variant="secondary" className="gap-1">
                      {emailAddr}
                      <button
                        onClick={() => handleRemoveEmail(emailAddr)}
                        className="ml-1 hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              {/* Optional Message */}
              <div className="space-y-2">
                <Label htmlFor="message">Message (optional)</Label>
                <Textarea
                  id="message"
                  placeholder="Add a personal message to your invitation..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                />
              </div>

              {emails.length > 0 && (
                <Button onClick={handleSendInvitations} className="w-full gap-2">
                  <Mail className="h-4 w-4" />
                  Send {emails.length} invitation{emails.length > 1 ? 's' : ''}
                </Button>
              )}
            </div>
          </div>

          <Separator />

          {/* People with Access */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">People with access</h3>
            <div className="space-y-3">
              {permissions.map((permission) => (
                <div
                  key={permission.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={permission.user.avatar} />
                      <AvatarFallback>
                        {permission.user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{permission.user.name}</p>
                      <p className="text-xs text-muted-foreground">{permission.user.email}</p>
                    </div>
                    {permission.status === 'pending' && (
                      <Badge variant="outline" className="text-xs">
                        Pending
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {getRoleIcon(permission.role)}
                      <span className="hidden sm:inline">{permission.role}</span>
                    </div>
                    {permission.role !== 'owner' && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => onUpdatePermission(permission.id, 'viewer')}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Make Viewer
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onUpdatePermission(permission.id, 'commentor')}
                          >
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Make Commentor
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onUpdatePermission(permission.id, 'editor')}
                          >
                            <Edit3 className="mr-2 h-4 w-4" />
                            Make Editor
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onRemovePermission(permission.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove Access
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Role Descriptions */}
          <div className="space-y-3 bg-muted/30 p-4 rounded-lg">
            <h4 className="text-sm font-semibold">Permission levels</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">Owner:</span>
                <span className="text-muted-foreground">Full access and management</span>
              </div>
              <div className="flex items-center gap-2">
                <Edit3 className="h-4 w-4 text-blue-500" />
                <span className="font-medium">Editor:</span>
                <span className="text-muted-foreground">Can edit test cases and add new ones</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-purple-500" />
                <span className="font-medium">Commentor:</span>
                <span className="text-muted-foreground">Can view and add comments to test cases</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-green-500" />
                <span className="font-medium">Viewer:</span>
                <span className="text-muted-foreground">Can view all content, read-only access</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}