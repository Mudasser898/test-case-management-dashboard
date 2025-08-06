#!/usr/bin/env powershell

Write-Host ""
Write-Host "🚀 Test Case Dashboard - GitHub Setup" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check if Git is installed
try {
    $gitVersion = git --version 2>$null
    Write-Host "✅ Git is installed! ($gitVersion)" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "❌ Git is not installed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Git first:" -ForegroundColor Yellow
    Write-Host "1. Go to: https://git-scm.com/download/win" -ForegroundColor White
    Write-Host "2. Download and install Git" -ForegroundColor White
    Write-Host "3. Restart this terminal" -ForegroundColor White
    Write-Host "4. Run this script again" -ForegroundColor White
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if this is already a git repository
if (Test-Path ".git") {
    Write-Host "⚠️  This is already a Git repository." -ForegroundColor Yellow
    Write-Host ""
    $continue = Read-Host "Do you want to continue anyway? (y/n)"
    if ($continue -ne "y" -and $continue -ne "Y") {
        Write-Host "Operation cancelled." -ForegroundColor Yellow
        Read-Host "Press Enter to exit"
        exit 0
    }
    Write-Host ""
}

Write-Host "📝 Setting up Git repository..." -ForegroundColor Cyan
Write-Host ""

# Initialize git repository
Write-Host "Initializing Git repository..." -ForegroundColor White
git init

# Add all files
Write-Host "Adding all files to Git..." -ForegroundColor White
git add .

# Create initial commit
Write-Host "Creating initial commit..." -ForegroundColor White
$commitMessage = @"
Initial commit - Professional Test Case Management Dashboard

Features:
- Epic-based test organization with dropdown selection
- Bulk CSV upload/download with sample templates  
- AI-powered test case generation
- Real-time collaboration with comments
- Dark/light theme switching
- Mobile responsive design
- PostgreSQL database with audit logging
- Vercel deployment ready

Tech Stack: Next.js 15, TypeScript, Tailwind CSS, Prisma, shadcn/ui
"@

git commit -m $commitMessage

Write-Host ""
Write-Host "✅ Git repository set up successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "🎯 Next steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Create a new repository on GitHub:" -ForegroundColor Yellow
Write-Host "   - Go to: https://github.com/new" -ForegroundColor White
Write-Host "   - Repository name: test-case-dashboard" -ForegroundColor White
Write-Host "   - Description: Professional test case management dashboard" -ForegroundColor White
Write-Host "   - Make it Public or Private (your choice)" -ForegroundColor White
Write-Host "   - DON'T initialize with README (we have our own)" -ForegroundColor White
Write-Host "   - Click 'Create repository'" -ForegroundColor White
Write-Host ""
Write-Host "2. After creating the GitHub repo, run these commands:" -ForegroundColor Yellow
Write-Host "   (Replace YOUR_USERNAME with your GitHub username)" -ForegroundColor Gray
Write-Host ""
Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/test-case-dashboard.git" -ForegroundColor Green
Write-Host "   git branch -M main" -ForegroundColor Green
Write-Host "   git push -u origin main" -ForegroundColor Green
Write-Host ""
Write-Host "3. Your code will be live on GitHub!" -ForegroundColor Yellow
Write-Host ""
Write-Host "4. Then deploy to Vercel:" -ForegroundColor Yellow
Write-Host "   - Go to: https://vercel.com" -ForegroundColor White
Write-Host "   - Import your GitHub repository" -ForegroundColor White
Write-Host "   - Follow the DEPLOYMENT.md guide" -ForegroundColor White
Write-Host ""
Write-Host "🎉 Your professional Test Case Dashboard will be live!" -ForegroundColor Magenta
Write-Host ""

# Ask if they want to open GitHub in browser
$openGithub = Read-Host "Would you like to open GitHub in your browser now? (y/n)"
if ($openGithub -eq "y" -or $openGithub -eq "Y") {
    Start-Process "https://github.com/new"
}

Write-Host ""
Read-Host "Press Enter to exit"

