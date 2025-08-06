export interface TestCase {
  id: string;
  userId: string; // Added for multi-tenancy
  application: string;
  module: string;
  testType: string;
  testScenarioId: string;
  testScenario: string;
  epic: string;
  title: string;
  description: string;
  detailedSteps: string[];
  expectedResult: string;
  actualBehavior: string;
  status: 'Not Run' | 'Passed' | 'Failed';
  notes: string;
  evidence: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Epic {
  id: string;
  name: string;
  passed: number;
  total: number;
}

export interface FilterState {
  status: 'all' | 'passed' | 'failed' | 'not-run';
  epic: string | null;
  search: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Permission {
  id: string;
  userId: string;
  user: User;
  role: 'owner' | 'editor' | 'viewer' | 'commentor';
  invitedAt: Date;
  acceptedAt?: Date;
  status: 'pending' | 'accepted' | 'declined';
}

export interface Comment {
  id: string;
  testCaseId: string;
  userId: string;
  user: User;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShareInvitation {
  email: string;
  role: 'editor' | 'viewer' | 'commentor';
  message?: string;
}

export interface TestCaseTemplate {
  id: string;
  name: string;
  description: string;
  application: string;
  module: string;
  testType: string;
  sampleTestCases: {
    title: string;
    description: string;
    steps: string[];
    expectedResult: string;
  }[];
}

export interface AIMessage {
  id: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    generatedTestCases?: number;
    template?: string;
  };
}

export interface AIGenerationRequest {
  prompt: string;
  template?: string;
  application?: string;
  module?: string;
  testType?: string;
  count?: number;
}

export interface CurrentSession {
  userId: string;
  name: string;
  email: string;
  createdAt: Date;
}