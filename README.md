# 🧪 Test Case Management Dashboard

A modern, professional test case management dashboard built with Next.js, featuring AI-powered test generation, real-time collaboration, and comprehensive test tracking capabilities.

![Test Case Dashboard](https://img.shields.io/badge/Built%20with-Next.js-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)

## ✨ Features

### 🎯 Core Test Management
- **Create & Edit Test Cases** - Intuitive interface for test case management
- **Epic Organization** - Group test cases by epic with dynamic selection
- **Status Tracking** - Track test execution status (Passed, Failed, Not Run, Blocked)
- **Bulk Operations** - Import/export test cases via CSV with sample templates

### 🤖 AI-Powered Features
- **AI Test Generation** - Generate test cases from templates using AI assistant
- **Smart Templates** - Pre-built templates for common testing scenarios
- **Contextual Suggestions** - AI-powered test case recommendations

### 👥 Collaboration & Sharing
- **Team Collaboration** - Share dashboards with role-based permissions
- **Real-time Comments** - Add comments and collaborate on test cases
- **Permission Management** - Owner, Editor, Viewer, and Commentor roles

### 🎨 User Experience
- **Dark/Light Themes** - Toggle between themes with persistent preferences
- **Mobile Responsive** - Fully responsive design for all devices
- **Collapsible Sidebar** - Optimized workspace management
- **Expandable Test Cases** - Detailed view with notes and evidence

### 🗄️ Data Management
- **Multi-user Support** - Complete user data isolation
- **Audit Logging** - Track all changes with comprehensive audit trails
- **Export/Import** - CSV export/import with customizable fields
- **Search & Filter** - Advanced filtering by epic, status, and text search

## 🚀 Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Production), SQLite (Development)
- **ORM**: Prisma
- **Authentication**: Custom session-based auth
- **Deployment**: Vercel-ready with Docker support

## 📦 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL (for production)

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/test-case-dashboard.git
   cd test-case-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp environment.example .env
   # Edit .env with your database URL and other configurations
   ```

4. **Set up database**
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   ```
   http://localhost:3000
   ```

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **Prepare for deployment**
   ```bash
   npm run deploy:vercel
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Set environment variables in Vercel dashboard
   - Deploy with one click

3. **Set up production database**
   - Use Supabase, PlanetScale, or your preferred PostgreSQL provider
   - Add `DATABASE_URL` to Vercel environment variables

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## 📋 Usage Examples

### Adding Test Cases
```
Epic: Authentication
ID: TC1.1
Description: User can login with valid credentials
Expected Result: User successfully logged in and redirected to dashboard
Status: Passed
```

### Bulk Import CSV Format
```csv
Epic,ID,Description,Expected Result,Status,Notes
Authentication,TC1.1,User login with valid credentials,Successful login,Passed,Working as expected
Authentication,TC1.2,User login with invalid credentials,Error message displayed,Failed,Fix error styling
```

### AI Test Generation
Use the AI assistant to generate test cases from templates:
- Select "Login Functionality" template
- AI generates comprehensive test scenarios
- Customize and add to your test suite

## 🔧 Configuration

### Environment Variables
```bash
# Database
DATABASE_URL="postgresql://username:password@hostname:port/database"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="https://your-app.vercel.app"

# Optional: AI Features
OPENAI_API_KEY="sk-your-openai-key"
```

### Features Configuration
- **AI Features**: Set `ENABLE_AI_FEATURES=true`
- **Email Notifications**: Configure SMTP settings
- **File Uploads**: Set up cloud storage providers

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](./CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🎯 Roadmap

- [ ] Advanced reporting and analytics
- [ ] Integration with popular testing frameworks
- [ ] Advanced AI features with custom models
- [ ] Mobile app for iOS/Android
- [ ] API documentation and SDK
- [ ] Advanced permission management

## 📞 Support

- 📧 **Email**: [Your Email]
- 🐛 **Issues**: [GitHub Issues](https://github.com/YOUR_USERNAME/test-case-dashboard/issues)
- 📖 **Documentation**: [Wiki](https://github.com/YOUR_USERNAME/test-case-dashboard/wiki)

## 🌟 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Database management with [Prisma](https://prisma.io/)

---

**Made with ❤️ for better test management**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/test-case-dashboard)