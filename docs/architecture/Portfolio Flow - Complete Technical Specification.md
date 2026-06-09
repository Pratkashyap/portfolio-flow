# Portfolio Flow - Complete Technical Specification

## Project Overview

**Product Name:** Portfolio Flow  
**Purpose:** Allow Manus users to create professional portfolio websites in 5-10 minutes without coding  
**Target Users:** Job seekers, freelancers, professionals wanting online portfolios  
**Hosting:** Free on Manus subdomains (format: `[slug]-[userId].manus.space`)  
**Authentication:** Manus OAuth (users must be logged into Manus)  

---

## User Journey (Complete Flow)

### Step 1: Landing Page
- **URL:** `/`
- **Components:**
  - Hero section with headline "Create Your Professional Portfolio in Minutes"
  - Subheading: "Upload resume, answer 5 questions, get a live portfolio. Free forever."
  - "Get Started" CTA button (blue, prominent)
  - 3 feature cards below
  - Footer with links

### Step 2: Resume Upload Page
- **URL:** `/create`
- **Requires:** User must be logged in (Manus OAuth)
- **Components:**
  - Drag-and-drop area for resume upload
  - Accepts: PDF, DOC, DOCX, TXT files
  - File size limit: 10MB
  - Tips box with best practices
  - "Upload & Continue" button
  - Shows loading state during processing

### Step 3: Questionnaire Page
- **URL:** `/questionnaire`
- **Requires:** Resume successfully uploaded
- **Questions (5 total):**
  1. "What's your job title?" (text input)
  2. "Years of experience?" (dropdown: 0-2, 2-5, 5-10, 10+)
  3. "Work style?" (radio: Data-Driven, Creative, Collaborative, Leadership)
  4. "Key achievement?" (textarea)
  5. "Preferred design?" (radio: Minimalist, Bold & Modern, Creative)

### Step 4: Template Selection
- **URL:** `/templates`
- **Requires:** Questionnaire completed
- **Options (3 templates):**
  1. **Minimalist** - Clean, simple, white/gray
  2. **Bold & Modern** - Navy/Mint, modern fonts
  3. **Creative** - Colorful, artistic layout

### Step 5: Portfolio Preview
- **URL:** `/preview`
- **Shows:** Full portfolio preview with all data
- **Actions:** Edit button (goes back to questionnaire), Publish button

### Step 6: Success Page
- **URL:** `/success`
- **Shows:** 
  - Success message
  - Portfolio URL (e.g., `prateek-kashyap-1.manus.space`)
  - Copy link button
  - Share buttons (LinkedIn, Twitter, Email)

### Step 7: Generated Portfolio
- **URL:** `[slug]-[userId].manus.space`
- **Shows:** Full portfolio with all resume data, formatted according to selected template

---

## Data Model

### User Data (from Manus OAuth)
```
{
  id: number (from Manus)
  openId: string (unique Manus identifier)
  name: string
  email: string
  loginMethod: string
  role: "user" | "admin"
  createdAt: timestamp
  updatedAt: timestamp
}
```

### Resume Data (extracted from upload)
```
{
  name: string (required)
  email: string (optional)
  phone: string (optional)
  summary: string (optional)
  experience: [
    {
      company: string
      role: string
      duration: string
      description: string
    }
  ]
  skills: [string]
  education: [
    {
      school: string
      degree: string
      field: string
    }
  ]
}
```

### Questionnaire Data
```
{
  jobTitle: string
  yearsExperience: "0-2" | "2-5" | "5-10" | "10+"
  workStyle: "Data-Driven" | "Creative" | "Collaborative" | "Leadership"
  keyAchievement: string
  designPreference: "Minimalist" | "Bold & Modern" | "Creative"
}
```

### Portfolio Data (stored in database)
```
{
  id: number
  userId: number
  slug: string (unique, e.g., "prateek-kashyap")
  title: string
  resumeData: JSON (resume extracted data)
  questionnaireData: JSON (questionnaire answers)
  template: "Minimalist" | "Bold & Modern" | "Creative"
  status: "draft" | "published"
  url: string (e.g., "prateek-kashyap-1.manus.space")
  createdAt: timestamp
  updatedAt: timestamp
  publishedAt: timestamp
}
```

---

## Resume Parsing Strategy

### Approach: Hybrid (Reliable)

**Priority 1: Simple Text Extraction (80% success)**
- Extract name: Look for first line or capitalized words
- Extract email: Regex pattern for email addresses
- Extract phone: Regex pattern for phone numbers
- Extract skills: Look for "Skills" section, split by comma/bullet
- Extract experience: Look for date patterns (2020-2022, Jan 2020, etc.)
- Extract education: Look for degree keywords (Bachelor, Master, MBA, etc.)

**Priority 2: LLM Enhancement (for complex cases)**
- Use LLM only if simple extraction fails
- Ask LLM to fill in missing fields
- Never rely on LLM as primary method

**Priority 3: Manual Entry (fallback)**
- If parsing fails, show form for user to enter data manually
- Don't block the user, allow them to proceed

---

## Portfolio Display (Critical - Currently Missing)

### Portfolio Page Structure
```
[Slug]-[UserId].manus.space
├── Hero Section
│   ├── Name (large)
│   ├── Job Title
│   └── Contact Info (email, phone, LinkedIn)
├── Professional Summary
├── Experience Section
│   ├── Company 1
│   ├── Company 2
│   └── ...
├── Skills Section
│   └── Grid/List of skills
├── Education Section
│   ├── Degree 1
│   └── Degree 2
└── Footer
    └── Social links
```

### Template Implementations

**Template 1: Minimalist**
- White background, gray text
- Simple sans-serif font
- Minimal spacing
- Clean, professional look

**Template 2: Bold & Modern**
- Navy header, white content
- Modern typography
- Mint accent color
- Contemporary design

**Template 3: Creative**
- Colorful background
- Artistic layout
- Varied typography
- Unique design

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  openId VARCHAR(64) UNIQUE NOT NULL,
  name TEXT,
  email VARCHAR(320),
  loginMethod VARCHAR(64),
  role ENUM('user', 'admin') DEFAULT 'user',
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW() ON UPDATE NOW(),
  lastSignedIn TIMESTAMP DEFAULT NOW()
);
```

### Portfolios Table
```sql
CREATE TABLE portfolios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255),
  resumeData JSON,
  questionnaireData JSON,
  template VARCHAR(50),
  status ENUM('draft', 'published') DEFAULT 'draft',
  url VARCHAR(255),
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW() ON UPDATE NOW(),
  publishedAt TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);
```

---

## API Endpoints (tRPC Procedures)

### Authentication
- `auth.me` - Get current user
- `auth.logout` - Logout user

### Portfolio Operations
- `portfolio.create` - Create new portfolio (draft)
- `portfolio.update` - Update portfolio data
- `portfolio.publish` - Publish portfolio to live URL
- `portfolio.getBySlug` - Get portfolio by slug (public)
- `portfolio.getByUser` - Get all portfolios for user
- `portfolio.delete` - Delete portfolio

### Resume Processing
- `resume.upload` - Upload and parse resume
- `resume.parse` - Parse resume text

---

## File Structure

```
portfolio-flow/
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx (landing page)
│   │   │   ├── CreatePortfolio.tsx (resume upload)
│   │   │   ├── Questionnaire.tsx (5 questions)
│   │   │   ├── TemplateSelection.tsx (template choice)
│   │   │   ├── Preview.tsx (preview before publish)
│   │   │   ├── Success.tsx (success page)
│   │   │   └── PortfolioDisplay.tsx (public portfolio view)
│   │   ├── components/
│   │   │   ├── PortfolioTemplate.tsx (renders templates)
│   │   │   └── ...
│   │   └── App.tsx (routing)
├── server/
│   ├── resumeParser.ts (extract resume data)
│   ├── portfolioService.ts (portfolio generation)
│   ├── routers.ts (tRPC endpoints)
│   └── db.ts (database queries)
├── drizzle/
│   └── schema.ts (database schema)
└── package.json
```

---

## Key Features

✅ **Manus OAuth Integration** - Users login with Manus account  
✅ **Resume Upload** - PDF/DOC/TXT support  
✅ **Resume Parsing** - Extract structured data  
✅ **Questionnaire** - 5 personalization questions  
✅ **Template Selection** - 3 design options  
✅ **Portfolio Generation** - Create unique URL  
✅ **Portfolio Display** - Public portfolio page  
✅ **Sharing** - LinkedIn, Twitter, Email share buttons  
✅ **Free Hosting** - On Manus subdomains  
✅ **Dashboard** - View all created portfolios  

---

## Success Criteria

✅ User can upload resume → portfolio generated in < 10 minutes  
✅ Portfolio displays at unique URL (e.g., prateek-kashyap-1.manus.space)  
✅ Portfolio shows all resume data formatted nicely  
✅ User can share portfolio via multiple channels  
✅ No errors or blank pages  
✅ Works on mobile and desktop  
✅ Fast loading (< 2 seconds)  

---

## Known Issues to Fix

❌ Resume parsing fails on some formats → Need hybrid approach  
❌ Portfolio doesn't display at generated URL → Need to implement display pages  
❌ LLM parsing unreliable → Need fallback to simple extraction  
❌ No error recovery → Need manual entry option  
❌ No end-to-end testing → Need real test with actual resumes  

---

## Implementation Priority

1. **CRITICAL:** Fix portfolio display (users see blank pages)
2. **CRITICAL:** Implement reliable resume parsing (hybrid approach)
3. **HIGH:** Add manual data entry fallback
4. **HIGH:** Test end-to-end with real resumes
5. **MEDIUM:** Add portfolio dashboard
6. **MEDIUM:** Add portfolio editing
7. **LOW:** Add analytics

---

## Estimated Rebuild Time

- Portfolio display implementation: 2-3 hours
- Resume parsing fix: 2-3 hours
- Manual entry fallback: 1-2 hours
- End-to-end testing: 2-3 hours
- Bug fixes and polish: 2-3 hours

**Total: 10-15 hours of focused work**

---

## Success Example

**User:** Prateek Kashyap  
**Resume:** 5,462 characters, 9 years experience  
**Process:**
1. Upload resume (2 min)
2. Answer questionnaire (2 min)
3. Select template (1 min)
4. Review preview (1 min)
5. Publish (30 sec)

**Result:** Live portfolio at `prateek-kashyap-1.manus.space` with:
- Name, email, phone
- 5 work positions
- 12 skills
- 2 education entries
- Professional summary
- Contact information
- Shareable link

**Total Time:** 6-7 minutes  
**Status:** ✅ Working and live

---

## Technical Stack

- **Frontend:** React 19, Tailwind CSS 4, TypeScript
- **Backend:** Node.js, Express, tRPC
- **Database:** MySQL/TiDB
- **Authentication:** Manus OAuth
- **Hosting:** Manus
- **File Upload:** PDF, DOC, DOCX, TXT
- **Resume Parsing:** Hybrid (regex + LLM fallback)

---

## Notes for Other Developers

If you're building this elsewhere, focus on:

1. **Portfolio Display First** - Make sure generated portfolios actually display
2. **Reliable Parsing** - Don't rely solely on LLM, use regex + fallback
3. **Error Recovery** - Always provide manual entry option
4. **Testing** - Test with 10+ real resumes before launch
5. **Simple First** - Build with manual entry first, add automation later

This specification should be enough to build this on any platform (Next.js, Vue, Django, etc.).
