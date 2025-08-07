"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Bot,
  Send,
  Sparkles,
  Copy,
  Check,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import type { AIMessage, TestCaseTemplate, TestCase } from "@/types";

interface AIChatBotProps {
  onTestCasesGenerated: (testCases: Omit<TestCase, 'id' | 'createdAt' | 'updatedAt'>[]) => void;
}

export function AIChatBot({ onTestCasesGenerated }: AIChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [templates, setTemplates] = useState<TestCaseTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [application, setApplication] = useState("");
  const [module, setModule] = useState("");
  const [testType, setTestType] = useState("Functional");
  const [copied, setCopied] = useState<string | null>(null);
  
  const { currentSession } = useAuth();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load available templates
    fetchTemplates();
    
    // Add welcome message
    if (messages.length === 0) {
      const welcomeMessage: AIMessage = {
        id: 'welcome',
        userId: 'system',
        role: 'assistant',
        content: `Hi! I'm your AI testing assistant. I can help you generate comprehensive test cases for your applications.

Here's what I can do:
🎯 Generate Test Cases
📋 Use Templates  
🔍 Smart Analysis
✨ Detailed Steps

What would you like to test today?`,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length]);

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/templates');
      if (response.ok) {
        const data = await response.json();
        setTemplates(data);
      }
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !currentSession) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      userId: currentSession.userId,
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: inputMessage,
          template: selectedTemplate,
          application,
          module,
          testType,
          userId: currentSession.userId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        const aiMessage: AIMessage = {
          id: (Date.now() + 1).toString(),
          userId: 'system',
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
          metadata: {
            generatedTestCases: data.testCases?.length || 0,
            template: selectedTemplate,
          },
        };

        setMessages(prev => [...prev, aiMessage]);

        // If test cases were generated, add them to the dashboard
        if (data.testCases && data.testCases.length > 0) {
          onTestCasesGenerated(data.testCases);
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        userId: 'system',
        role: 'assistant',
        content: "I'm sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const applyTemplate = (template: TestCaseTemplate) => {
    setSelectedTemplate(template.id);
    setApplication(template.application);
    setModule(template.module);
    setTestType(template.testType);
    setInputMessage(`Generate test cases for ${template.application} - ${template.module} functionality using the ${template.name} template.`);
  };

  const copyToClipboard = async (content: string, messageId: string) => {
    await navigator.clipboard.writeText(content);
    setCopied(messageId);
    setTimeout(() => setCopied(null), 2000);
  };

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white gap-2">
          <Bot className="h-4 w-4" />
          AI Assistant
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[85vw] h-[80vh] max-w-none overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-600" />
            AI Test Case Generator
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 h-full">
          {/* Templates & Settings */}
          <div className="space-y-4 lg:space-y-4 overflow-y-auto">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Quick Templates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {templates.slice(0, 3).map((template) => (
                  <Button
                    key={template.id}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-left h-auto p-3"
                    onClick={() => applyTemplate(template)}
                  >
                    <div>
                      <div className="font-medium text-xs">{template.name}</div>
                      <div className="text-xs text-muted-foreground">{template.application}</div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Test Context</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium">Application</label>
                  <Input
                    placeholder="e.g., FCH Application"
                    value={application}
                    onChange={(e) => setApplication(e.target.value)}
                    className="text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Module</label>
                  <Input
                    placeholder="e.g., Login, Dashboard"
                    value={module}
                    onChange={(e) => setModule(e.target.value)}
                    className="text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Test Type</label>
                  <Select value={testType} onValueChange={setTestType}>
                    <SelectTrigger className="text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Functional">Functional</SelectItem>
                      <SelectItem value="Integration">Integration</SelectItem>
                      <SelectItem value="UI/UX">UI/UX</SelectItem>
                      <SelectItem value="Performance">Performance</SelectItem>
                      <SelectItem value="Security">Security</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2 flex flex-col">
            <ScrollArea className="flex-1 p-4 border rounded-lg" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      <div className="whitespace-pre-wrap text-sm break-words overflow-hidden">{message.content}</div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-xs opacity-70">
                          {formatTimestamp(message.timestamp)}
                        </div>
                        {message.role === 'assistant' && (
                          <div className="flex items-center gap-2">
                            {message.metadata?.generatedTestCases && (
                              <Badge variant="secondary" className="text-xs">
                                {message.metadata.generatedTestCases} test cases
                              </Badge>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => copyToClipboard(message.content, message.id)}
                            >
                              {copied === message.id ? (
                                <Check className="h-3 w-3" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Bot className="h-4 w-4 animate-pulse" />
                        Generating test cases...
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="mt-4 space-y-3">
              <div className="flex gap-2">
                <Textarea
                  placeholder="Describe what you want to test..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  rows={3}
                  className="resize-none text-sm"
                />
                <Button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="h-auto"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-xs text-muted-foreground break-words">
                💡 Try: &quot;Generate login test cases for admin and regular users&quot;
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}