@echo off
echo.
echo 🚀 Test Case Dashboard - GitHub Setup
echo =====================================
echo.

REM Check if Git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git is not installed!
    echo.
    echo Please install Git first:
    echo 1. Go to: https://git-scm.com/download/win
    echo 2. Download and install Git
    echo 3. Restart this terminal
    echo 4. Run this script again
    echo.
    pause
    exit /b 1
)

echo ✅ Git is installed!
echo.

REM Check if this is already a git repository
if exist ".git" (
    echo ⚠️  This is already a Git repository.
    echo.
    set /p continue="Do you want to continue anyway? (y/n): "
    if /i not "%continue%"=="y" (
        echo Operation cancelled.
        pause
        exit /b 0
    )
    echo.
)

echo 📝 Setting up Git repository...
echo.

REM Initialize git repository
git init

REM Add all files
echo Adding all files to Git...
git add .

REM Create initial commit
echo Creating initial commit...
git commit -m "Initial commit - Professional Test Case Management Dashboard

Features:
- Epic-based test organization with dropdown selection
- Bulk CSV upload/download with sample templates  
- AI-powered test case generation
- Real-time collaboration with comments
- Dark/light theme switching
- Mobile responsive design
- PostgreSQL database with audit logging
- Vercel deployment ready

Tech Stack: Next.js 15, TypeScript, Tailwind CSS, Prisma, shadcn/ui"

echo.
echo ✅ Git repository set up successfully!
echo.
echo 🎯 Next steps:
echo.
echo 1. Create a new repository on GitHub:
echo    - Go to: https://github.com/new
echo    - Repository name: test-case-dashboard
echo    - Description: Professional test case management dashboard
echo    - Make it Public or Private (your choice)
echo    - DON'T initialize with README (we have our own)
echo    - Click "Create repository"
echo.
echo 2. After creating the GitHub repo, run these commands:
echo    (Replace YOUR_USERNAME with your GitHub username)
echo.
echo    git remote add origin https://github.com/YOUR_USERNAME/test-case-dashboard.git
echo    git branch -M main  
echo    git push -u origin main
echo.
echo 3. Your code will be live on GitHub!
echo.
echo 4. Then deploy to Vercel:
echo    - Go to: https://vercel.com
echo    - Import your GitHub repository
echo    - Follow the DEPLOYMENT.md guide
echo.
echo 🎉 Your professional Test Case Dashboard will be live!
echo.
pause

