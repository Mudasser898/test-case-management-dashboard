#!/bin/bash

# Test Case Dashboard - Vercel Deployment Script
# This script prepares the application for Vercel deployment

echo "🚀 Preparing Test Case Dashboard for Vercel deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is not installed"
    exit 1
fi

echo "✅ Environment checks passed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Copy production schema
echo "🗄️  Setting up production database schema..."
cp prisma/schema.production.prisma prisma/schema.prisma

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Type check
echo "🔍 Running type check..."
npm run type-check

# Lint check
echo "🧹 Running linter..."
npm run lint

# Build the application
echo "🔨 Building application..."
npm run build

echo "✅ Build completed successfully!"
echo ""
echo "🎉 Your application is ready for Vercel deployment!"
echo ""
echo "Next steps:"
echo "1. Commit and push your changes to GitHub"
echo "2. Connect your GitHub repository to Vercel"
echo "3. Set up environment variables in Vercel dashboard"
echo "4. Deploy!"
echo ""
echo "Don't forget to:"
echo "- Set up a PostgreSQL database (Supabase/PlanetScale recommended)"
echo "- Configure environment variables in Vercel"
echo "- Run database migrations after deployment"
