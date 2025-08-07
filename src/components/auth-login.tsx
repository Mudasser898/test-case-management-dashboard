"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Bot, TestTube, Sparkles, Users } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

export function AuthLogin() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const { login, createGuestSession } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && email.trim()) {
      login(name.trim(), email.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-xl">
              <TestTube className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              AI Test Dashboard
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
            Generate intelligent test cases with AI assistance
          </p>
          
          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <Bot className="h-6 w-6 text-blue-600" />
              <div className="text-left">
                <h3 className="font-semibold text-gray-900 dark:text-white">AI-Powered</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Smart test case generation</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <Sparkles className="h-6 w-6 text-purple-600" />
              <div className="text-left">
                <h3 className="font-semibold text-gray-900 dark:text-white">Templates</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Pre-built test templates</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <Users className="h-6 w-6 text-green-600" />
              <div className="text-left">
                <h3 className="font-semibold text-gray-900 dark:text-white">Isolated</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Your own private workspace</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Login Form */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-center">Get Started</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={!name.trim() || !email.trim()}>
                  Create My Dashboard
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full" 
                onClick={createGuestSession}
              >
                Try as Guest
              </Button>
              
              <p className="text-xs text-center text-muted-foreground">
                Each user gets their own isolated workspace. No data is shared between users.
              </p>
            </CardContent>
          </Card>

          {/* Preview/Demo */}
          <Card className="shadow-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700">
            <CardHeader>
              <CardTitle className="text-center">What You&apos;ll Get</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium">AI Test Case Generation</h4>
                    <p className="text-sm text-muted-foreground">
                      Describe your application and let AI generate comprehensive test cases
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium">Smart Templates</h4>
                    <p className="text-sm text-muted-foreground">
                      Pre-built templates for login, forms, navigation, and more
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium">Collaboration Tools</h4>
                    <p className="text-sm text-muted-foreground">
                      Share with team members, add comments, track progress
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium">Private Workspace</h4>
                    <p className="text-sm text-muted-foreground">
                      Your data is completely isolated and secure
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                <div className="text-center text-sm text-muted-foreground">
                  <Bot className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  AI Bot will help you generate test cases instantly!
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}