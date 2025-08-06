"use client";

import { useState, useEffect } from "react";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { TestCaseCard } from "@/components/test-case-card";
import { AddTestCaseModal } from "@/components/add-test-case-modal";
import { ShareDashboardModal } from "@/components/share-dashboard-modal";
import { AIChatBot } from "@/components/ai-chat-bot";
import { AuthLogin } from "@/components/auth-login";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useUser } from "@/contexts/user-context";
import { useAuth } from "@/contexts/auth-context";
import type { TestCase, Epic, FilterState, Permission, ShareInvitation } from "@/types";

export default function Dashboard() {
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [epics, setEpics] = useState<Epic[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    status: 'all',
    epic: null,
    search: '',
  });
  const [loading, setLoading] = useState(true);
  const [expandedTestCase, setExpandedTestCase] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  const { permissions, canEdit, canView, fetchPermissions } = useUser();
  const { currentSession, isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Initialize database with default data
      await fetch('/api/init');
      
      // Then fetch data
      await fetchEpics();
      await fetchTestCases();
    } catch (error) {
      console.error('Failed to initialize app:', error);
    }
  };

  useEffect(() => {
    fetchTestCases();
  }, [filters]);

  const fetchEpics = async () => {
    if (!currentSession) return;
    
    try {
      const params = new URLSearchParams();
      params.append('userId', currentSession.userId);
      
      const response = await fetch(`/api/epics?${params}`);
      const data = await response.json();
      setEpics(data);
    } catch (error) {
      console.error('Failed to fetch epics:', error);
    }
  };

  const fetchTestCases = async () => {
    if (!currentSession) return;
    
    try {
      const params = new URLSearchParams();
      params.append('userId', currentSession.userId);
      if (filters.status !== 'all') params.append('status', filters.status);
      if (filters.epic) params.append('epic', filters.epic);
      if (filters.search) params.append('search', filters.search);

      const response = await fetch(`/api/testcases?${params}`);
      const data = await response.json();
      
      // If new user has no test cases, create some default ones
      if (data.length === 0 && filters.status === 'all' && !filters.epic && !filters.search) {
        await createDefaultTestCases();
        // Fetch again after creating defaults
        const retryResponse = await fetch(`/api/testcases?userId=${currentSession.userId}`);
        const retryData = await retryResponse.json();
        setTestCases(retryData);
      } else {
        setTestCases(data);
      }
    } catch (error) {
      console.error('Failed to fetch test cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const createDefaultTestCases = async () => {
    if (!currentSession) return;
    
    const defaultTestCases = [
      {
        userId: currentSession.userId,
        application: "FCH Application",
        module: "Authentication",
        testType: "Functional",
        testScenarioId: "TS_LOGIN_001",
        testScenario: "User Login Functionality",
        epic: "authentication",
        title: "Valid User Login",
        description: "Verify that a user can successfully log in with valid credentials",
        detailedSteps: [
          "Navigate to login page",
          "Enter valid username", 
          "Enter valid password",
          "Click Login button"
        ],
        expectedResult: "User should be successfully logged in and redirected to dashboard",
        actualBehavior: "",
        status: "Passed" as const,
        notes: "Working as expected",
        evidence: "Screenshot attached showing successful login"
      },
      {
        userId: currentSession.userId,
        application: "FCH Application", 
        module: "Authentication",
        testType: "Functional",
        testScenarioId: "TS_LOGIN_002",
        testScenario: "Invalid Login Attempts",
        epic: "authentication",
        title: "Invalid Password Login",
        description: "Verify error message is shown when user enters invalid password",
        detailedSteps: [
          "Navigate to login page",
          "Enter valid username",
          "Enter invalid password", 
          "Click Login button"
        ],
        expectedResult: "Error message should be displayed: 'Invalid credentials'",
        actualBehavior: "",
        status: "Not Run" as const,
        notes: "",
        evidence: ""
      }
    ];

    try {
      const promises = defaultTestCases.map(testCase => 
        fetch('/api/testcases', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(testCase),
        })
      );
      await Promise.all(promises);
    } catch (error) {
      console.error('Failed to create default test cases:', error);
    }
  };

  const handleAddTestCase = async (testCaseData: Omit<TestCase, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    if (!currentSession) return;
    
    try {
      const response = await fetch('/api/testcases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...testCaseData,
          userId: currentSession.userId,
        }),
      });

      if (response.ok) {
        fetchTestCases();
        fetchEpics(); // Refresh epic counts
      }
    } catch (error) {
      console.error('Failed to add test case:', error);
    }
  };

  const handleEditTestCase = async (testCase: TestCase) => {
    // For now, just log - you can implement edit modal later
    console.log('Edit test case:', testCase);
  };

  const handleUpdateTestCase = async (testCase: TestCase) => {
    if (!currentSession) return;
    
    try {
      const response = await fetch('/api/testcases', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...testCase,
          userId: currentSession.userId,
        }),
      });

      if (response.ok) {
        fetchTestCases();
      }
    } catch (error) {
      console.error('Failed to update test case:', error);
    }
  };

  const handleToggleExpand = (testCaseId: string) => {
    setExpandedTestCase(prev => prev === testCaseId ? null : testCaseId);
  };

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(prev => !prev);
  };

  const handleInviteUsers = async (invitations: ShareInvitation[]) => {
    try {
      const response = await fetch('/api/permissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ invitations }),
      });

      if (response.ok) {
        fetchPermissions();
      }
    } catch (error) {
      console.error('Failed to invite users:', error);
    }
  };

  const handleUpdatePermission = async (permissionId: string, role: string) => {
    try {
      const response = await fetch('/api/permissions', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ permissionId, role }),
      });

      if (response.ok) {
        fetchPermissions();
      }
    } catch (error) {
      console.error('Failed to update permission:', error);
    }
  };

  const handleRemovePermission = async (permissionId: string) => {
    try {
      const response = await fetch(`/api/permissions?id=${permissionId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchPermissions();
      }
    } catch (error) {
      console.error('Failed to remove permission:', error);
    }
  };

  const handleDeleteTestCase = async (id: string) => {
    if (!currentSession) return;
    
    try {
      const response = await fetch(`/api/testcases?id=${id}&userId=${currentSession.userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchTestCases();
        fetchEpics(); // Refresh epic counts
      }
    } catch (error) {
      console.error('Failed to delete test case:', error);
    }
  };

  const handleAITestCasesGenerated = async (aiTestCases: Omit<TestCase, 'id' | 'createdAt' | 'updatedAt'>[]) => {
    if (!currentSession) return;
    
    try {
      // Add all AI-generated test cases
      const promises = aiTestCases.map(testCase => 
        fetch('/api/testcases', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...testCase,
            userId: currentSession.userId,
          }),
        })
      );

      await Promise.all(promises);
      fetchTestCases();
      fetchEpics();
    } catch (error) {
      console.error('Failed to add AI-generated test cases:', error);
    }
  };

  const handleBulkAddTestCases = async (bulkTestCases: Omit<TestCase, 'id' | 'createdAt' | 'updatedAt'>[]) => {
    if (!currentSession) return;
    
    try {
      // Use bulk API endpoint for better performance and error handling
      const response = await fetch('/api/testcases/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testCases: bulkTestCases,
          userId: currentSession.userId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Bulk upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      // Show summary to user
      if (result.errors && result.errors.length > 0) {
        console.warn('Some test cases had errors:', result.errors);
      }
      
      console.log(`Bulk import completed: ${result.created} created, ${result.updated} updated`);
      
      fetchTestCases();
      fetchEpics();
    } catch (error) {
      console.error('Failed to add bulk test cases:', error);
      throw error; // Re-throw to allow UI to show error
    }
  };

  const downloadTestCasesCSV = () => {
    if (testCases.length === 0) {
      alert('No test cases to download');
      return;
    }

    const csvHeaders = 'Epic,ID,Description,Expected Result,Status,Notes,Evidence,Created Date\n';
    const csvContent = testCases.map(tc => {
      const values = [
        tc.epic,
        tc.id,
        `"${tc.description.replace(/"/g, '""')}"`,
        `"${tc.expectedResult.replace(/"/g, '""')}"`,
        tc.status,
        `"${(tc.notes || '').replace(/"/g, '""')}"`,
        `"${(tc.evidence || '').replace(/"/g, '""')}"`,
        new Date(tc.createdAt).toLocaleDateString()
      ];
      return values.join(',');
    }).join('\n');

    const fullCsvContent = csvHeaders + csvContent;
    const blob = new Blob([fullCsvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `test-cases-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Show loading screen while checking authentication
  if (authLoading) {
    return (
      <div className="flex min-h-screen bg-background items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!isAuthenticated || !currentSession) {
    return <AuthLogin />;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar
        epics={epics}
        filters={filters}
        onFiltersChange={setFilters}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
      />
      
      <main className="flex-1 p-3 md:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
          <div className="min-w-0">
            <h1 className="text-xl md:text-2xl font-bold text-foreground truncate">All Test Cases</h1>
            <p className="text-xs md:text-sm text-muted-foreground">
              Welcome back, {currentSession?.name || 'User'}! You have {testCases.length} test cases.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <Button
              variant="outline"
              onClick={downloadTestCasesCSV}
              className="flex items-center gap-2"
              disabled={testCases.length === 0}
            >
              <FileText className="h-4 w-4" />
              Download CSV
            </Button>
            <AIChatBot onTestCasesGenerated={handleAITestCasesGenerated} />
            <ShareDashboardModal
              permissions={permissions}
              onInviteUsers={handleInviteUsers}
              onUpdatePermission={handleUpdatePermission}
              onRemovePermission={handleRemovePermission}
            />
            {canEdit && (
              <AddTestCaseModal 
                epics={epics} 
                onAddTestCase={handleAddTestCase}
                onBulkAddTestCases={handleBulkAddTestCases}
              />
            )}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-48 bg-card border border-border rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
            {testCases.map((testCase) => (
              <TestCaseCard
                key={testCase.id}
                testCase={testCase}
                isExpanded={expandedTestCase === testCase.id}
                onEdit={canEdit ? handleEditTestCase : () => {}}
                onDelete={canEdit ? handleDeleteTestCase : () => {}}
                onUpdate={canEdit ? handleUpdateTestCase : () => {}}
                onToggleExpand={handleToggleExpand}
              />
            ))}
          </div>
        )}

        {!loading && testCases.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-sm md:text-lg">
              No test cases found matching your filters.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
