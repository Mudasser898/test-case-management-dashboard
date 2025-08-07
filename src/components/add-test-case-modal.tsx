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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, FileText } from "lucide-react";
import type { TestCase, Epic } from "@/types";

interface AddTestCaseModalProps {
  epics: Epic[];
  onAddTestCase: (testCase: Omit<TestCase, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => void;
  onBulkAddTestCases?: (testCases: Omit<TestCase, 'id' | 'createdAt' | 'updatedAt' | 'userId'>[]) => void;
}

export function AddTestCaseModal({ epics, onAddTestCase, onBulkAddTestCases }: AddTestCaseModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    epic: '',
    title: '',
    description: '',
    expectedResult: '',
    status: 'Not Run' as TestCase['status'],
  });
  const [newEpicName, setNewEpicName] = useState('');
  const [isCreatingNewEpic, setIsCreatingNewEpic] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [bulkResults, setBulkResults] = useState<{ success: number; errors: string[] } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.epic || !formData.title || !formData.description || !formData.expectedResult) {
      return;
    }

    onAddTestCase({
      ...formData,
      application: 'Test Application',
      module: 'General',
      testType: 'Functional',
      testScenarioId: `TS_${Date.now()}`,
      testScenario: formData.title,
      detailedSteps: [formData.description],
      actualBehavior: '',
      notes: '',
      evidence: '',
    });
    setFormData({
      epic: '',
      title: '',
      description: '',
      expectedResult: '',
      status: 'Not Run',
    });
    setOpen(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateSampleCSV = () => {
    const csvContent = `Epic,ID,Description,Expected Result,Status,Notes,Evidence,Application,Module,Test Type,Actual Behavior
Authentication,TC1.1,User can login with valid credentials,User should be successfully logged in,Passed,Working as expected,Screenshot of successful login,Web App,Login,Functional,User successfully logged in
Authentication,TC1.2,User sees error with invalid credentials,Error message should be displayed,Failed,Need to fix error message,Error screenshot attached,Web App,Login,Functional,No error message shown
Dashboard,TC2.1,User can view dashboard after login,Dashboard loads with user data,Not Run,,"",Web App,Dashboard,Functional,""
Dashboard,TC2.2,User can navigate between sections,Navigation works correctly,Passed,All navigation links working,Navigation flow video,Web App,Dashboard,Functional,Navigation working perfectly
API,TC3.1,Test user creation API endpoint,API should return 201 status with user data,Passed,API working correctly,Postman collection attached,API,User Management,API Testing,201 status returned with correct user data`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'test-cases-sample.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleBulkUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvFile || !onBulkAddTestCases) return;

    try {
      const text = await csvFile.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        setBulkResults({
          success: 0,
          errors: ['CSV file must contain at least a header row and one data row']
        });
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim());
      
      // Validate headers
      const requiredHeaders = ['Epic', 'ID', 'Description', 'Expected Result'];
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
      
      if (missingHeaders.length > 0) {
        setBulkResults({
          success: 0,
          errors: [`Missing required headers: ${missingHeaders.join(', ')}`]
        });
        return;
      }

      const errors: string[] = [];
      const validTestCases: Omit<TestCase, 'id' | 'createdAt' | 'updatedAt' | 'userId'>[] = [];

      for (let i = 1; i < lines.length; i++) {
        try {
          // Simple CSV parsing (handles basic quotes)
          const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
          const rowData: Record<string, string> = {};
          
          headers.forEach((header, index) => {
            rowData[header] = values[index] || '';
          });

          // Validate required fields
          if (!rowData.Epic || !rowData.ID || !rowData.Description || !rowData['Expected Result']) {
            errors.push(`Row ${i + 1}: Missing required fields (Epic, ID, Description, Expected Result)`);
            continue;
          }

          // Create test case data
          const testCaseData = {
            epic: rowData.Epic,
            title: `${rowData.ID} - ${rowData.Description}`,
            description: rowData.Description,
            expectedResult: rowData['Expected Result'],
            status: (rowData.Status as TestCase['status']) || 'Not Run',
            application: rowData.Application || 'Bulk Import',
            module: rowData.Module || 'General',
            testType: rowData['Test Type'] || 'Functional',
            testScenarioId: rowData.ID,
            testScenario: rowData.Description,
            detailedSteps: [rowData.Description],
            actualBehavior: rowData['Actual Behavior'] || '',
            notes: rowData.Notes || '',
            evidence: rowData.Evidence || '',
          } as Omit<TestCase, 'id' | 'createdAt' | 'updatedAt' | 'userId'>;
          
          validTestCases.push(testCaseData);
        } catch {
          errors.push(`Row ${i + 1}: Failed to parse row data`);
        }
      }

      // Process valid test cases
      if (validTestCases.length > 0) {
        await onBulkAddTestCases(validTestCases);
      }

      setBulkResults({ 
        success: validTestCases.length, 
        errors 
      });
      
      if (validTestCases.length > 0 && errors.length === 0) {
        setCsvFile(null);
        setOpen(false);
      }
            } catch {
      setBulkResults({
        success: 0,
        errors: ['Failed to process CSV file. Please check the file format.']
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Add Test Case
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Test Case</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="single" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="single">Single</TabsTrigger>
            <TabsTrigger value="bulk">Bulk</TabsTrigger>
          </TabsList>
          
          <TabsContent value="single" className="space-y-4">
            <h3 className="text-lg font-semibold">Add Single Test Case</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="epic">Epic</Label>
                {isCreatingNewEpic ? (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter new epic name"
                      value={newEpicName}
                      onChange={(e) => setNewEpicName(e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (newEpicName.trim()) {
                          handleInputChange('epic', newEpicName.trim());
                          setNewEpicName('');
                        }
                        setIsCreatingNewEpic(false);
                      }}
                    >
                      Add
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setIsCreatingNewEpic(false);
                        setNewEpicName('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Select value={formData.epic} onValueChange={(value) => {
                      if (value === 'create-new') {
                        setIsCreatingNewEpic(true);
                      } else {
                        handleInputChange('epic', value);
                      }
                    }}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select an epic" />
                      </SelectTrigger>
                      <SelectContent>
                        {epics.map((epic) => (
                          <SelectItem key={epic.id} value={epic.name}>
                            {epic.name}
                          </SelectItem>
                        ))}
                        <SelectItem value="create-new">
                          <div className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Create New Epic
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="testCaseId">Test Case ID</Label>
                <Input
                  id="testCaseId"
                  placeholder="e.g., TC1.1"
                  value={formData.title.split(' - ')[0] || ''}
                  onChange={(e) => {
                    const id = e.target.value;
                    const title = formData.title.includes(' - ') 
                      ? formData.title.split(' - ').slice(1).join(' - ')
                      : formData.title;
                    handleInputChange('title', id + (title ? ' - ' + title : ''));
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Test Case Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what this test case verifies..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expectedResult">Expected Result</Label>
                <Textarea
                  id="expectedResult"
                  placeholder="Describe the expected outcome..."
                  value={formData.expectedResult}
                  onChange={(e) => handleInputChange('expectedResult', e.target.value)}
                  rows={4}
                />
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Add Test Case
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="bulk" className="space-y-4">
            <h3 className="text-lg font-semibold">Bulk Import Test Cases</h3>
            <p className="text-muted-foreground">
              Upload a CSV file with your test cases. Required fields: Epic, ID, Description, Expected Result
            </p>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={generateSampleCSV}
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Download Sample CSV
                </Button>
              </div>

              <form onSubmit={handleBulkUpload} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="csvFile">CSV File</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6">
                    <input
                      id="csvFile"
                      type="file"
                      accept=".csv"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        setCsvFile(file || null);
                        setBulkResults(null);
                      }}
                      className="w-full"
                    />
                    <div className="mt-2 text-sm text-muted-foreground">
                      <p>• Required columns: Epic, ID, Description, Expected Result</p>
                      <p>• Optional columns: Status, Notes, Evidence, Application, Module, Test Type, Actual Behavior</p>
                      <p>• File format: CSV with comma separation</p>
                      <p>• Duplicate IDs will update existing test cases</p>
                    </div>
                  </div>
                </div>

                {csvFile && (
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm font-medium">{csvFile.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({(csvFile.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                  </div>
                )}

                <Button 
                  type="submit" 
                  disabled={!csvFile}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Import Test Cases
                </Button>
              </form>

              {bulkResults && (
                <div className="space-y-2">
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium text-green-600">
                      Successfully imported: {bulkResults.success} test cases
                    </h4>
                    
                    {bulkResults.errors.length > 0 && (
                      <div className="mt-3">
                        <h5 className="font-medium text-red-600 mb-2">
                          Errors ({bulkResults.errors.length}):
                        </h5>
                        <ul className="text-sm text-red-600 space-y-1">
                          {bulkResults.errors.slice(0, 5).map((error, index) => (
                            <li key={index}>• {error}</li>
                          ))}
                          {bulkResults.errors.length > 5 && (
                            <li>• ... and {bulkResults.errors.length - 5} more errors</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}