# 🚀 Test Case Dashboard - Vercel Deployment Guide

This guide will walk you through deploying your Test Case Management Dashboard to Vercel with a PostgreSQL database.

## 📋 Prerequisites

- GitHub account
- Vercel account (free tier available)
- Database provider account (Supabase recommended - free tier available)

## 🌟 Step-by-Step Deployment

### 1. 📁 Prepare Your Code

First, ensure your code is in a GitHub repository:

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit - Test Case Dashboard"

# Add your GitHub repository as origin
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git push -u origin main
```

### 2. 🗄️ Set Up Database (Supabase - Recommended)

#### Option A: Supabase (Free PostgreSQL)

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up/log in with GitHub
4. Create a new project:
   - **Name**: `test-case-dashboard`
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose closest to your users
5. Wait for project creation (2-3 minutes)
6. Go to **Settings** → **Database**
7. Copy the **Connection String** (URI format)
8. Replace `[YOUR-PASSWORD]` with your actual password

#### Option B: PlanetScale (Alternative)

1. Go to [planetscale.com](https://planetscale.com)
2. Sign up with GitHub
3. Create new database
4. Get connection string from dashboard

### 3. 🌐 Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up/log in with your GitHub account
3. Click **"New Project"**
4. **Import Git Repository**:
   - Select your GitHub repository
   - Click **"Import"**

5. **Configure Project**:
   - **Framework Preset**: Next.js (auto-detected)
   - **Build Command**: `npm run deploy:vercel`
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

6. **Environment Variables** - Add these in Vercel dashboard:
   ```
   DATABASE_URL=your_postgresql_connection_string_from_step_2
   NEXTAUTH_SECRET=generate_random_32_char_string
   NEXTAUTH_URL=https://your-app-name.vercel.app
   ```

   To generate NEXTAUTH_SECRET:
   ```bash
   openssl rand -base64 32
   ```

7. Click **"Deploy"**

### 4. 🗃️ Set Up Database Schema

After successful deployment:

1. **Run Database Migrations**:
   - Go to your Vercel project dashboard
   - Click **"Functions"** tab
   - Find and run: `api/migrate` (if available)
   
   OR use terminal:
   ```bash
   # Set DATABASE_URL environment variable
   export DATABASE_URL="your_postgresql_connection_string"
   
   # Run migrations
   npx prisma migrate deploy
   ```

2. **Initialize Data**:
   - Open your deployed app: `https://your-app.vercel.app`
   - The app will automatically create initial data on first load

### 5. 👤 Create Your Account

1. **Open Your Deployed App**: `https://your-app.vercel.app`

2. **First Time Setup**:
   - You'll see a login screen
   - Click **"Continue as Guest"** to start
   - Or create a proper account by:
     - Using the guest session initially
     - Adding your email in the user profile
     - Setting up proper authentication

3. **Test Features**:
   - ✅ Create test cases
   - ✅ Bulk upload CSV
   - ✅ Download test cases
   - ✅ Use AI assistant
   - ✅ Share dashboard
   - ✅ Switch themes
   - ✅ Mobile responsiveness

### 6. 🔧 Post-Deployment Configuration

#### A. Custom Domain (Optional)
1. In Vercel dashboard → **Settings** → **Domains**
2. Add your custom domain
3. Update `NEXTAUTH_URL` environment variable

#### B. Performance Monitoring
1. Enable Vercel Analytics in project settings
2. Monitor performance and errors

#### C. Backup Strategy
1. Set up database backups in Supabase/PlanetScale
2. Export test data regularly

## 🔐 Security Checklist

- ✅ Strong `NEXTAUTH_SECRET` (32+ characters)
- ✅ Database connection uses SSL
- ✅ Environment variables are secure
- ✅ No sensitive data in code
- ✅ CORS properly configured

## 📱 Testing Your Deployment

### Test Cases to Verify:

1. **Authentication**:
   - ✅ Guest login works
   - ✅ Session persistence
   - ✅ User isolation

2. **Core Features**:
   - ✅ Add/edit/delete test cases
   - ✅ Epic management
   - ✅ Bulk CSV upload/download
   - ✅ Search and filtering

3. **Advanced Features**:
   - ✅ AI test case generation
   - ✅ Comments system
   - ✅ Theme switching
   - ✅ Mobile responsive design

4. **Performance**:
   - ✅ Page load times < 3 seconds
   - ✅ Database queries optimized
   - ✅ Images optimized

## 🐛 Troubleshooting

### Common Issues:

1. **Build Fails**:
   ```bash
   # Check build logs in Vercel dashboard
   # Common fixes:
   - Ensure all dependencies in package.json
   - Check TypeScript errors
   - Verify environment variables
   ```

2. **Database Connection Errors**:
   ```bash
   # Verify DATABASE_URL format:
   postgresql://username:password@hostname:port/database?sslmode=require
   
   # Test connection:
   npx prisma db push
   ```

3. **Environment Variables Not Working**:
   - Redeploy after adding env vars
   - Check variable names (case sensitive)
   - Ensure no extra spaces

## 📞 Support

If you encounter issues:

1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify database connectivity
4. Test with fresh browser session

## 🎉 Success!

Your Test Case Management Dashboard is now live at:
**https://your-app.vercel.app**

### What You Can Do Now:

- 📝 **Create test cases** with the intuitive interface
- 📊 **Bulk import** test cases via CSV upload
- 🤖 **Generate test cases** using AI assistant
- 👥 **Share your dashboard** with team members
- 📱 **Access from any device** (mobile responsive)
- 🌙 **Switch themes** (light/dark mode)
- 📈 **Track progress** with epic management
- 💬 **Collaborate** with comments system

## 🔄 Updates and Maintenance

To update your app:
1. Make changes to your code
2. Push to GitHub
3. Vercel automatically redeploys
4. Run database migrations if schema changed

---

**Congratulations!** 🎊 Your Test Case Management Dashboard is now live and ready for professional use!
