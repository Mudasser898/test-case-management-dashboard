import { NextResponse } from 'next/server';
import type { TestCaseTemplate } from '@/types';

// Templates based on the provided spreadsheet
const mockTemplates: TestCaseTemplate[] = [
  {
    id: 'login-template',
    name: 'Login Functionality',
    description: 'Comprehensive login testing template for different user types',
    application: 'FCH Application',
    module: 'Login',
    testType: 'Functional',
    sampleTestCases: [
      {
        title: 'Verify Super Admin type user is able to login with valid Email and Password',
        description: 'Test that Super Admin users can successfully login with correct credentials',
        steps: [
          'Go to Login Page',
          'Enter valid Email and password for Super Admin',
          'Click on Login button',
          'Verify user is able to login successfully'
        ],
        expectedResult: 'Super Admin type user should be able to login with valid Email and Password'
      },
      {
        title: 'Verify Admin type user is able to login with valid Email and Password',
        description: 'Test that Admin users can successfully login with correct credentials',
        steps: [
          'Go to Login Page',
          'Enter valid Email and password for Admin',
          'Click on Login button',
          'Verify user is able to login successfully'
        ],
        expectedResult: 'Admin type user should be able to login with valid Email and Password'
      },
      {
        title: 'Verify User type user is able to login with valid Email and Password',
        description: 'Test that regular users can successfully login with correct credentials',
        steps: [
          'Go to Login Page',
          'Enter valid Email and password',
          'Click on Login button',
          'Verify user is able to login successfully'
        ],
        expectedResult: 'User type user should be able to login with valid Email and Password'
      }
    ]
  },
  {
    id: 'password-reset-template',
    name: 'Password Reset',
    description: 'Password reset functionality testing template',
    application: 'FCH Application',
    module: 'Login',
    testType: 'Functional',
    sampleTestCases: [
      {
        title: 'Verify user is able to reset their password using "Forgot Password?" feature',
        description: 'Test password reset functionality with valid email',
        steps: [
          'Go to Login Page',
          'Click on Forgot Password',
          'Enter valid Email address',
          'Click on Send Reset Link',
          'Check email for reset link',
          'Enter new password in the webpage opened in new tab',
          'Go back to Login Page',
          'Login with the new password',
          'Verify user is able to login successfully'
        ],
        expectedResult: 'User should be able to reset their password using "Forgot Password?" feature'
      }
    ]
  },
  {
    id: 'google-auth-template',
    name: 'Google Authentication',
    description: 'Google OAuth login testing template',
    application: 'FCH Application',
    module: 'Login',
    testType: 'Functional',
    sampleTestCases: [
      {
        title: 'Verify user is able to login with Google SAML',
        description: 'Test Google OAuth authentication flow',
        steps: [
          'Go to Login page',
          'Make sure user is logged in with gmail account in the chrome browser for the logged in gmail account',
          'Click on Sign in with Google button',
          'Verify user is able to login successfully'
        ],
        expectedResult: 'User should be able to login with Google SAML'
      }
    ]
  },
  {
    id: 'form-validation-template',
    name: 'Form Validation',
    description: 'General form validation testing template',
    application: 'Web Application',
    module: 'Forms',
    testType: 'Functional',
    sampleTestCases: [
      {
        title: 'Verify required field validation',
        description: 'Test that required fields show appropriate validation messages',
        steps: [
          'Navigate to the form',
          'Leave required fields empty',
          'Submit the form',
          'Verify validation messages appear'
        ],
        expectedResult: 'Required field validation messages should be displayed'
      },
      {
        title: 'Verify email format validation',
        description: 'Test email field format validation',
        steps: [
          'Navigate to form with email field',
          'Enter invalid email format',
          'Submit or move focus away',
          'Verify validation message appears'
        ],
        expectedResult: 'Email format validation should trigger for invalid formats'
      }
    ]
  },
  {
    id: 'navigation-template',
    name: 'Navigation Testing',
    description: 'Website navigation and menu testing template',
    application: 'Web Application',
    module: 'Navigation',
    testType: 'Functional',
    sampleTestCases: [
      {
        title: 'Verify main menu navigation',
        description: 'Test that all main menu items work correctly',
        steps: [
          'Load the homepage',
          'Click on each main menu item',
          'Verify correct pages load',
          'Check page titles and content'
        ],
        expectedResult: 'All main menu items should navigate to correct pages'
      },
      {
        title: 'Verify breadcrumb navigation',
        description: 'Test breadcrumb functionality',
        steps: [
          'Navigate to a deep page',
          'Check breadcrumb display',
          'Click on breadcrumb links',
          'Verify navigation works'
        ],
        expectedResult: 'Breadcrumb navigation should work correctly'
      }
    ]
  },
  {
    id: 'responsive-template',
    name: 'Responsive Design',
    description: 'Mobile and responsive design testing template',
    application: 'Web Application',
    module: 'UI/UX',
    testType: 'UI/UX',
    sampleTestCases: [
      {
        title: 'Verify mobile responsiveness',
        description: 'Test application behavior on mobile devices',
        steps: [
          'Open application on mobile device or browser mobile view',
          'Test navigation and menus',
          'Verify content layout',
          'Test form interactions'
        ],
        expectedResult: 'Application should be fully functional on mobile devices'
      },
      {
        title: 'Verify tablet responsiveness',
        description: 'Test application on tablet screen sizes',
        steps: [
          'Set browser to tablet dimensions',
          'Navigate through key pages',
          'Test interactive elements',
          'Verify content readability'
        ],
        expectedResult: 'Application should adapt properly to tablet screen sizes'
      }
    ]
  }
];

export async function GET() {
  return NextResponse.json(mockTemplates);
}