# Getting Started with Portfolio Flow

## Quick Start (5 minutes)

### 1. Prerequisites
- Node.js 22+
- pnpm (or npm)
- MySQL/TiDB database
- GitHub account (for OAuth)

### 2. Clone & Install

```bash
# Clone the repository
git clone https://github.com/Pratkashyap/portfolio-flow.git
cd portfolio-flow

# Install dependencies
pnpm install
```

### 3. Environment Setup

```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your values
# Required:
# - DATABASE_URL=mysql://user:pass@host/db
# - JWT_SECRET=your-secret-key
# - VITE_APP_ID=your-oauth-app-id
# - OAUTH_SERVER_URL=https://api.manus.im
# - VITE_OAUTH_PORTAL_URL=https://manus.im/login
```

### 4. Database Setup

```bash
# Push schema to database
pnpm db:push

# Verify tables created
# Should see: users, portfolios, resumes tables
```

### 5. Start Development Server

```bash
# Start dev server (runs on http://localhost:3000)
pnpm dev

# In another terminal, watch for TypeScript errors
pnpm tsc --watch
```

### 6. Open in Browser

```
http://localhost:3000
```

---

## Development Workflow

### Running Tests

```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test -- server/hybridResumeParser.test.ts

# Watch mode (re-run on file changes)
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

### Building for Production

```bash
# Build frontend
pnpm build

# Start production server
pnpm start

# Check build size
pnpm build --analyze
```

### Database Migrations

```bash
# Generate migration from schema changes
pnpm db:generate

# Apply migrations
pnpm db:migrate

# Push schema (dev only)
pnpm db:push

# View database studio (visual editor)
pnpm db:studio
```

---

## Project Structure

### Frontend (`client/`)

```
client/
├── src/
│   ├── pages/
│   │   ├── Home.tsx              # Landing page
│   │   ├── CreatePortfolio.tsx   # 4-step portfolio builder
│   │   └── MyPortfolios.tsx      # User's portfolios
│   ├── components/
│   │   ├── ui/                   # shadcn/ui components
│   │   ├── DashboardLayout.tsx   # Main layout
│   │   └── ...
│   ├── lib/
│   │   ├── trpc.ts               # tRPC client setup
│   │   └── utils.ts
│   ├── contexts/
│   │   └── AuthContext.tsx       # Auth state
│   ├── App.tsx                   # Routes
│   ├── main.tsx                  # Entry point
│   └── index.css                 # Global styles
├── public/
│   ├── favicon.ico
│   └── robots.txt
└── package.json
```

### Backend (`server/`)

```
server/
├── routers.ts                    # tRPC procedures
├── db.ts                         # Database queries
├── hybridResumeParser.ts         # Resume extraction
├── resumeParser.ts               # Parser + LLM
├── pdfHandler.ts                 # PDF conversion
├── portfolioHTMLGenerator.ts     # HTML generation
├── githubService.ts              # GitHub integration
├── portfolioService.ts           # Portfolio logic
├── _core/
│   ├── context.ts                # tRPC context
│   ├── auth.ts                   # OAuth handling
│   ├── env.ts                    # Environment vars
│   ├── llm.ts                    # LLM integration
│   ├── voiceTranscription.ts
│   ├── imageGeneration.ts
│   ├── map.ts
│   └── notification.ts
└── *.test.ts                     # Test files
```

### Database (`drizzle/`)

```
drizzle/
├── schema.ts                     # Table definitions
└── migrations/                   # Migration history
```

---

## Key Features to Explore

### 1. Resume Parsing

**File:** `server/hybridResumeParser.ts`

```typescript
import { parseResumeHybrid } from './hybridResumeParser';

const resumeText = `
  John Doe
  john@example.com
  +1-555-0123
  
  SKILLS
  JavaScript, React, Node.js
`;

const parsed = parseResumeHybrid(resumeText);
// Returns: { name, email, phone, skills, experience, education }
```

### 2. PDF Handling

**File:** `server/pdfHandler.ts`

```typescript
import { convertPdfToText } from './pdfHandler';

const pdfBuffer = fs.readFileSync('resume.pdf');
const text = await convertPdfToText(pdfBuffer);
// Returns: extracted text from PDF
```

### 3. Portfolio Generation

**File:** `server/portfolioHTMLGenerator.ts`

```typescript
import { generatePortfolioHTML } from './portfolioHTMLGenerator';

const html = generatePortfolioHTML({
  name: 'John Doe',
  email: 'john@example.com',
  skills: ['JavaScript', 'React'],
  experience: [...],
  template: 'modern'
});
// Returns: complete HTML portfolio
```

### 4. tRPC Procedures

**File:** `server/routers.ts`

```typescript
// Backend procedure
export const appRouter = router({
  resume: {
    uploadPdf: protectedProcedure
      .input(z.object({ file: z.instanceof(Buffer) }))
      .mutation(async ({ input, ctx }) => {
        // Handle resume upload
      })
  }
});

// Frontend usage
const { mutate } = trpc.resume.uploadPdf.useMutation({
  onSuccess: (data) => {
    console.log('Resume parsed:', data);
  }
});
```

---

## Common Tasks

### Add a New Page

1. Create `client/src/pages/NewPage.tsx`
2. Add route in `client/src/App.tsx`
3. Add navigation link in layout

### Add a Database Table

1. Define table in `drizzle/schema.ts`
2. Run `pnpm db:push`
3. Add query helpers in `server/db.ts`
4. Add tRPC procedures in `server/routers.ts`

### Add a New tRPC Procedure

```typescript
// server/routers.ts
export const appRouter = router({
  myFeature: {
    getData: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        // Query logic
        return data;
      }),
    
    updateData: protectedProcedure
      .input(z.object({ id: z.string(), value: z.string() }))
      .mutation(async ({ input, ctx }) => {
        // Mutation logic
        return result;
      })
  }
});

// client/src/pages/MyPage.tsx
const { data } = trpc.myFeature.getData.useQuery({ id: '123' });
const { mutate } = trpc.myFeature.updateData.useMutation();
```

### Test Your Changes

```bash
# Write test file: server/myFeature.test.ts
import { describe, it, expect } from 'vitest';

describe('My Feature', () => {
  it('should do something', () => {
    expect(true).toBe(true);
  });
});

# Run test
pnpm test -- server/myFeature.test.ts
```

---

## Debugging

### Server Logs

```bash
# Watch server logs
pnpm dev

# Look for [Resume Parser], [PDF Handler], etc. logs
```

### Browser Console

```bash
# Open DevTools (F12)
# Check Console tab for client-side errors
```

### Database Queries

```bash
# Open database studio
pnpm db:studio

# View/edit data directly
# URL: http://localhost:5555
```

### TypeScript Errors

```bash
# Check types
pnpm tsc --noEmit

# Watch mode
pnpm tsc --watch
```

---

## Troubleshooting

### "Cannot find module" Error

```bash
# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Database Connection Error

```bash
# Check DATABASE_URL in .env.local
# Verify MySQL/TiDB is running
# Test connection: mysql -u user -p -h host -D database
```

### Port Already in Use

```bash
# Change port in dev script
# Or kill process: lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill
```

### PDF Parsing Not Working

```bash
# Verify pdftotext is installed
which pdftotext

# If not installed:
# macOS: brew install poppler
# Ubuntu: apt-get install poppler-utils
# Windows: Download from xpdf.com
```

---

## Performance Tips

### Frontend
- Use React DevTools Profiler
- Check bundle size: `pnpm build --analyze`
- Lazy load components: `React.lazy()`
- Memoize expensive computations: `useMemo`

### Backend
- Check database query performance
- Use indexes on frequently queried columns
- Cache frequently accessed data
- Monitor response times

### General
- Use production builds for testing
- Monitor Lighthouse scores
- Profile with Chrome DevTools
- Use Web Vitals monitoring

---

## Next Steps

1. **Explore the Code**
   - Read `ARCHITECTURE.md` for system design
   - Check test files for usage examples
   - Review key components

2. **Make Changes**
   - Add a new feature
   - Fix a bug
   - Improve documentation

3. **Test Thoroughly**
   - Run all tests
   - Test in browser
   - Check for TypeScript errors

4. **Deploy**
   - Push to GitHub
   - Deploy to Manus (or your platform)
   - Monitor in production

---

## Resources

- [Manus Docs](https://docs.manus.im)
- [tRPC Docs](https://trpc.io)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Drizzle ORM](https://orm.drizzle.team)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## Getting Help

- Check existing issues on GitHub
- Review test files for examples
- Read inline code comments
- Check server logs for errors
- Ask in discussions

---

**Happy coding! 🚀**
