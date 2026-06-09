# Portfolio Generator - Complete Specification & Reference Guide

**Last Updated:** March 20, 2026  
**Status:** Ready for Development  
**Platform:** Manus-based (Free)

---

## 📋 Project Overview

A **web portal** where users upload their resume, LinkedIn URL, GitHub URL, and answer personality questions to automatically generate a professional portfolio website hosted on Manus.

**Key Features:**
- Resume upload & parsing
- LinkedIn & GitHub integration
- Personality-based questionnaire
- Multiple design templates (3-5 options)
- Auto-generated portfolio pages
- Free hosting on Manus subdomains
- Shareable portfolio links

---

## 🎯 User Journey

```
1. LANDING PAGE
   ↓
2. UPLOAD RESUME (PDF/text)
   ↓
3. ENTER LINKEDIN URL (optional)
   ↓
4. ENTER GITHUB URL (optional)
   ↓
5. ANSWER QUESTIONNAIRE (5-10 questions)
   ↓
6. SELECT DESIGN TEMPLATE (3-5 options)
   ↓
7. PREVIEW PORTFOLIO
   ↓
8. GENERATE & DEPLOY
   ↓
9. SHARE PORTFOLIO LINK
```

---

## 📝 Questionnaire Details

### Questions to Ask (5-10 total):

1. **Professional Role/Title**
   - Text input: "What is your current/desired job title?"
   - Examples: "Senior Analytics Manager", "Full Stack Developer"

2. **Years of Experience**
   - Dropdown: 0-2, 2-5, 5-10, 10+ years

3. **Work Style**
   - Radio buttons: Collaborative / Independent / Leadership-focused

4. **Key Achievement**
   - Text area: "Describe your proudest professional achievement"
   - Character limit: 200-300 chars

5. **Design Preference**
   - Radio buttons: Minimalist / Bold / Creative / Corporate / Modern

6. **Color Preference**
   - Radio buttons: Cool tones / Warm tones / Neutral

7. **Industry/Domain**
   - Dropdown: Tech, Finance, Marketing, Design, Consulting, Other

8. **Career Goal**
   - Text input: "What's your next career goal?"

9. **Unique Value Proposition**
   - Text area: "What makes you unique professionally?"

10. **Contact Preference**
    - Checkboxes: Email / LinkedIn / GitHub / Website

---

## 🎨 Design Templates

### Template 1: "Minimalist Professional"
- Clean, simple layout
- Navy sidebar + light background
- Minimal animations
- Focus on content

### Template 2: "Bold & Modern" (Recommended - Based on Your Portfolio)
- Mint & Navy color scheme
- Animated rotating titles
- Parallax effects
- Mouse-tracking animation
- Horizontal carousel for projects
- Similar to namansingh.com

### Template 3: "Creative Showcase"
- Colorful gradients
- Large hero image
- Card-based layouts
- Smooth transitions

### Template 4: "Corporate Executive"
- Professional serif fonts
- Subtle shadows
- Timeline-based experience
- Formal aesthetic

### Template 5: "Startup/Tech"
- Modern sans-serif
- Vibrant accent colors
- Grid-based layouts
- Tech-forward feel

---

## 📊 Data Collection & Processing

### Input Data:
```
{
  "resume": {
    "file": "PDF/text",
    "parsed": {
      "name": "string",
      "email": "string",
      "phone": "string",
      "experience": [
        {
          "company": "string",
          "role": "string",
          "duration": "string",
          "description": "string"
        }
      ],
      "skills": ["string"],
      "education": [
        {
          "school": "string",
          "degree": "string",
          "field": "string"
        }
      ]
    }
  },
  "linkedIn": {
    "url": "string",
    "profileData": "fetched via API or manual"
  },
  "github": {
    "url": "string",
    "username": "string",
    "projects": [
      {
        "name": "string",
        "description": "string",
        "url": "string",
        "language": "string",
        "stars": "number"
      }
    ]
  },
  "questionnaire": {
    "role": "string",
    "experience": "string",
    "workStyle": "string",
    "achievement": "string",
    "designPreference": "string",
    "colorPreference": "string",
    "industry": "string",
    "careerGoal": "string",
    "valueProposition": "string",
    "contactPreference": ["string"]
  },
  "selectedTemplate": "number (1-5)",
  "profilePhoto": "URL or uploaded image"
}
```

---

## 🏗️ Technical Architecture

### Frontend:
- **Framework:** React 19 + Tailwind CSS 4
- **Form handling:** React Hook Form + Zod validation
- **File upload:** Multer or similar
- **State management:** React Context or Zustand

### Backend (Manus):
- **Runtime:** Node.js + Express
- **Database:** PostgreSQL (Manus provides)
- **File storage:** S3 (Manus provides)
- **API:** RESTful endpoints

### Portfolio Generation:
- **Template engine:** React components
- **Styling:** Tailwind CSS with theme variables
- **Hosting:** Manus subdomains (auto-generated)
- **Export:** HTML/PDF download option

---

## 🔌 API Endpoints (Backend)

```
POST /api/upload-resume
  - Accepts PDF/text file
  - Returns parsed data

POST /api/fetch-github
  - Accepts GitHub username
  - Returns projects & stats

POST /api/fetch-linkedin
  - Accepts LinkedIn URL
  - Returns profile data (if available)

POST /api/questionnaire
  - Accepts questionnaire responses
  - Stores in database

POST /api/generate-portfolio
  - Accepts all user data
  - Creates portfolio page
  - Returns shareable link

GET /api/portfolio/:id
  - Retrieves generated portfolio
  - Returns portfolio data

PUT /api/portfolio/:id
  - Updates existing portfolio
  - Accepts partial data

DELETE /api/portfolio/:id
  - Deletes portfolio
```

---

## 💾 Database Schema

### Users Table:
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Portfolios Table:
```sql
CREATE TABLE portfolios (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  resume_data JSONB,
  questionnaire_data JSONB,
  github_data JSONB,
  linkedin_data JSONB,
  selected_template INTEGER,
  portfolio_url VARCHAR(255),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  is_published BOOLEAN DEFAULT false
);
```

### Portfolio Customizations Table:
```sql
CREATE TABLE portfolio_customizations (
  id UUID PRIMARY KEY,
  portfolio_id UUID REFERENCES portfolios(id),
  color_scheme VARCHAR(50),
  font_family VARCHAR(100),
  custom_sections JSONB,
  created_at TIMESTAMP
);
```

---

## 🎨 Design Reference (From Your Portfolio)

### Color Scheme:
- **Primary (Mint):** #10B981 / #06D6A0
- **Secondary (Navy):** #1E3A8A / #0F172A
- **Background:** #F8FAFC (light) / #0F172A (dark)
- **Text:** #1F2937 (dark) / #F1F5F9 (light)

### Typography:
- **Display Font:** Poppins (Bold, 700)
- **Body Font:** Inter (Regular, 400)
- **Heading Font:** Poppins (Semi-bold, 600)

### Animations:
- **Rotating titles:** Fade in/out every 3 seconds
- **Mouse tracking:** Mint glow following cursor
- **Hover effects:** Scale + shadow on cards
- **Parallax:** Background moves slower than foreground
- **Carousel:** Horizontal scroll with smooth transitions

### Components:
- Fixed sidebar (Navy, 256px width)
- Split-pane layout (text left, image right)
- Horizontal carousel for projects
- Grid layouts for skills/experience
- Contact form with validation
- Social media links (LinkedIn, GitHub, Email)

---

## 📱 Responsive Design

### Breakpoints:
- **Mobile:** < 640px (px-4, single column)
- **Tablet:** 640px - 1024px (px-6, 2 columns)
- **Desktop:** > 1024px (px-12, 3 columns)

### Mobile Optimizations:
- Stack sidebar above content
- Single column layouts
- Smaller font sizes (3xl → sm:4xl)
- Reduced padding/gaps
- Touch-friendly buttons (min 44px)

---

## 🚀 MVP Scope (Phase 1)

### Must-Have Features:
1. Resume upload & parsing
2. Questionnaire form (5-7 questions)
3. 3 design templates
4. Portfolio generation
5. Manus hosting & subdomain creation
6. Shareable portfolio link
7. Mobile responsive design

### Nice-to-Have (Phase 2):
1. GitHub auto-fetch
2. LinkedIn integration
3. Template customization (colors, fonts)
4. Portfolio editing/updates
5. Export to PDF/HTML
6. Analytics dashboard
7. Portfolio showcase/gallery

### Out of Scope (Phase 1):
1. Custom domain names
2. Premium features
3. Multi-language support
4. AI-powered recommendations
5. Community features

---

## 📊 Skills Taxonomy

### How to Extract & Categorize Skills:

#### 1. Technical Skills:
- Programming languages: Python, JavaScript, SQL, etc.
- Tools: Tableau, Power BI, Looker, etc.
- Platforms: AWS, Azure, GCP, etc.
- Frameworks: React, Django, FastAPI, etc.

#### 2. Domain Skills:
- Analytics, Marketing, Finance, Design, etc.
- Industry expertise: E-commerce, SaaS, etc.

#### 3. Soft Skills:
- Leadership, Communication, Project Management, etc.
- Problem-solving, Collaboration, etc.

#### 4. Certifications:
- Relevant credentials (AWS, Google Cloud, etc.)

### Auto-Detection Strategy:
1. Parse resume for skill keywords
2. Fetch GitHub languages & frameworks
3. Extract LinkedIn endorsements
4. Allow manual skill addition
5. Deduplicate & categorize

---

## 🔐 Security & Privacy

### Data Protection:
- HTTPS only
- Input validation & sanitization
- SQL injection prevention
- XSS protection
- CSRF tokens for forms

### User Privacy:
- No data sharing without consent
- GDPR compliant
- Clear privacy policy
- Data deletion option
- Secure file uploads

---

## 📈 Success Metrics

### Phase 1 (MVP):
- Portfolio generation success rate > 95%
- Page load time < 2 seconds
- Mobile responsiveness score > 90
- User satisfaction > 4/5 stars

### Phase 2 (Growth):
- User acquisition rate
- Portfolio shares/views
- Template usage distribution
- Feature adoption rates

---

## 🎯 Development Checklist

### Backend:
- [ ] Set up Express server
- [ ] Create database schema
- [ ] Implement resume parser
- [ ] Build API endpoints
- [ ] Add file upload handling
- [ ] Implement GitHub API integration
- [ ] Add error handling & logging
- [ ] Write unit tests

### Frontend:
- [ ] Create landing page
- [ ] Build resume upload form
- [ ] Design questionnaire form
- [ ] Create template selector
- [ ] Build portfolio preview
- [ ] Implement responsive design
- [ ] Add form validation
- [ ] Create success/error pages

### Portfolio Generation:
- [ ] Create template components
- [ ] Implement data mapping
- [ ] Build portfolio deployment logic
- [ ] Create subdomain assignment
- [ ] Add portfolio sharing feature
- [ ] Implement portfolio editing

### Testing & Deployment:
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] Performance testing
- [ ] Security audit
- [ ] Deploy to Manus
- [ ] Monitor & optimize

---

## 💡 Key Insights & Recommendations

### Design Philosophy:
- **Template 2 (Bold & Modern)** should be the default/recommended
- Use your portfolio as the reference design
- Maintain consistency across templates
- Ensure accessibility (WCAG 2.1 AA)

### User Experience:
- Keep questionnaire short (5-7 questions max)
- Show progress indicator
- Allow back/forward navigation
- Preview before generation
- One-click sharing

### Technical Considerations:
- Use React components for template reusability
- Implement caching for GitHub/LinkedIn data
- Optimize file uploads (max 5MB)
- Handle resume parsing errors gracefully
- Rate limit API calls

### Monetization (Future):
- Free tier: Basic templates, Manus subdomain
- Premium tier: Custom domains, advanced templates, analytics
- Enterprise: White-label, custom branding

---

## 📞 Questions for Clarification

Before starting development, confirm:

1. Should portfolios be editable after generation?
2. Do you want user accounts/authentication?
3. Should there be a portfolio gallery/showcase?
4. Any specific resume format requirements?
5. Should GitHub/LinkedIn be mandatory or optional?
6. Do you want email notifications?
7. Should portfolios have expiration dates?
8. Any specific compliance requirements (GDPR, etc.)?

---

## 🔗 Reference Links

- **Your Portfolio:** https://3000-igvdiklqc3t7df4wiqmgn-43a9b141.us2.manus.computer
- **Reference Design:** https://namansingh.com/
- **Manus Docs:** https://docs.manus.im
- **React Documentation:** https://react.dev
- **Tailwind CSS:** https://tailwindcss.com

---

## 📝 Next Steps

1. **Review this specification** with your team/stakeholders
2. **Confirm scope & requirements**
3. **Start a new chat** with this document as reference
4. **Begin Phase 1 development** (MVP)
5. **Deploy & gather user feedback**
6. **Plan Phase 2 enhancements**

---

**Document prepared by:** Manus AI Agent  
**For:** Portfolio Generator Project  
**Status:** Ready for Development  
**Last Updated:** March 20, 2026
