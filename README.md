<p align="center">
  <h1 align="center">⚡ PORTFOLIO FLOW</h1>
  <p align="center"><strong>Upload your resume. Answer 5 questions. Get a live portfolio.</strong></p>
</p>

> An AI-powered web app that turns any resume into a stunning, shareable portfolio website — in under 3 minutes.
> Built in public. Documented as it grows.

---

## What This Is

Portfolio Flow eliminates the single biggest friction in personal branding: the time it takes to go from resume to live portfolio.

Upload a PDF resume. Answer a short questionnaire. A fully-formed, hosted portfolio page is generated and live immediately — no code, no DevOps, no design skills needed.

**Hybrid AI parsing. Instant HTML generation. Zero setup for the end user.**

---

## How It Works

```
    ┌──────────────────────────────────────────────────┐
    │                   USER JOURNEY                    │
    └──────────────────────────────────────────────────┘

   [Upload Resume]  →  [Questionnaire]  →  [Preview]  →  [Live Portfolio]
        │                    │                │                │
        ▼                    ▼                ▼                ▼
   PDF → Text          5–7 questions     Review &         Hosted at
   extraction          about goals,      customise        subdomain
   + parsing           tone, style       before go-live   instantly
```

**Core Pipeline:**

```
                    ┌──────────────────────────┐
                    │        pdfHandler         │
                    │   PDF → raw text          │
                    └────────────┬─────────────┘
                                 │
                    ┌────────────▼─────────────┐
                    │   hybridResumeParser      │
                    │  Regex (primary, fast)    │
                    │  LLM (enhancement layer)  │
                    └────────────┬─────────────┘
                                 │
               ┌─────────────────┼──────────────────┐
               ▼                 ▼                   ▼
        Name / Email /      Experience /       Skills /
        Contact info        Education          Summary
               │                 │                   │
               └─────────────────▼───────────────────┘
                    ┌────────────────────────┐
                    │  portfolioHTMLGenerator │
                    │  Builds responsive HTML │
                    └────────────┬───────────┘
                                 │
                    ┌────────────▼───────────┐
                    │     Live Portfolio      │
                    │   Shareable instantly   │
                    └────────────────────────┘
```

**Key design decision:** The parser never fails. Regex handles extraction always; LLM enhancement is non-blocking and optional. If the LLM is unavailable, the user still gets their portfolio.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript + Tailwind CSS 4 |
| API Layer | tRPC 11 — end-to-end type safety, no REST boilerplate |
| Backend | Express 4 + Node.js |
| Database | MySQL / TiDB with Drizzle ORM |
| AI / LLM | Integrated LLM for resume enhancement and content enrichment |
| Auth | OAuth |
| Hosting | Manus Infrastructure — automatic SSL, CDN, free subdomains |

---

## Project Structure

```
portfolio-flow/
│
├── src/
│   ├── components/
│   │   ├── App.tsx                    # Routes & layout
│   │   ├── Home.tsx                   # Landing page
│   │   ├── CreatePortfolio.tsx        # Resume upload + creation flow
│   │   ├── Dashboard.tsx              # User portfolio dashboard
│   │   ├── Questionnaire.tsx          # Personalisation step
│   │   ├── TemplateSelection.tsx      # Choose portfolio style
│   │   ├── PortfolioPreview.tsx       # Review before publishing
│   │   ├── PortfolioDisplay.tsx       # Portfolio viewer
│   │   ├── PublicPortfolio.tsx        # Public shareable page
│   │   └── Success.tsx                # Post-publish confirmation
│   │
│   └── server/
│       ├── routers.ts                 # tRPC procedures — all API endpoints
│       ├── db.ts                      # Database queries
│       ├── schema.ts                  # Drizzle ORM table definitions
│       ├── hybridResumeParser.ts      # Regex + LLM hybrid extraction
│       ├── resumeParser.ts            # Parser with LLM enhancement layer
│       ├── pdfHandler.ts              # PDF to text conversion
│       ├── portfolioHTMLGenerator.ts  # Portfolio HTML builder
│       ├── portfolioService.ts        # Portfolio CRUD + business logic
│       ├── portfolioDisplayRouter.ts  # Public portfolio routing
│       ├── robustLLM.ts               # LLM wrapper with graceful fallback
│       └── githubService.ts           # GitHub profile integration
│
├── tests/
│   ├── hybridResumeParser.test.ts     # Core parser test suite
│   ├── resumeParser.test.ts           # Parser with enhancement tests
│   ├── pdfHandler.test.ts             # PDF conversion tests
│   ├── portfolioService.test.ts       # Portfolio service tests
│   ├── githubService.test.ts          # GitHub integration tests
│   ├── test-complete-flow.mjs         # End-to-end flow test
│   ├── test-complete-flow-screenshots.mjs
│   ├── test-resume-parsing.mjs
│   ├── test-riya-end-to-end.mjs
│   └── test-rubi-complete-flow.mjs
│
├── docs/
│   ├── architecture/                  # Technical specs & architecture guides
│   ├── guides/                        # User-facing how-to docs
│   ├── product/                       # Features, roadmap, project poster
│   └── social/                        # LinkedIn posts & build-in-public content
│
├── assets/
│   └── screenshots/                   # UI screenshots across key flows
│
└── todo.md
```

---

## Resume Parser — What It Extracts

| Field | Method |
|-------|--------|
| Name | Regex (all-caps + mixed-case support) |
| Email & Phone | Regex pattern matching |
| Professional Summary | Regex + LLM enhancement |
| Work Experience | Structured extraction — company, role, dates, description |
| Skills | Category-aware parsing |
| Education | School, degree, field, graduation year |

Supported resume formats: chronological, functional, combination, minimal.

---

## Key Screens

1. **Landing Page** — Value proposition and single clear CTA
2. **Resume Upload** — Drag-and-drop PDF interface
3. **Questionnaire** — 5–7 questions about goals, tone, links
4. **Portfolio Preview** — Review and edit before going live
5. **Live Portfolio** — Shareable, hosted, mobile-responsive page

---

## Quick Start

```bash
# Clone the repository
git clone https://github.com/Pratkashyap/portfolio-flow.git
cd portfolio-flow

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local

# Push database schema
pnpm db:push

# Start development server
pnpm dev
```

```bash
# Run tests
pnpm test

# Run a specific test file
pnpm test -- tests/hybridResumeParser.test.ts

# Watch mode
pnpm test:watch
```

---

## Performance

| Metric | Target |
|--------|--------|
| Resume parsing | < 2 seconds |
| Portfolio generation | < 1 second |
| Page load | < 1.5 seconds |
| Lighthouse score | 90+ |

---

## Roadmap

- [ ] Custom domain support
- [ ] Multiple portfolio templates
- [ ] Portfolio analytics (views, clicks)
- [ ] Social media preview cards
- [ ] PDF portfolio export
- [ ] GitHub project auto-import
- [ ] Advanced section customisation

---

## Live Demo

[https://portfoliow-itqbyqt8.manus.space](https://portfoliow-itqbyqt8.manus.space)

---

## Author

**Prateek Kashyap**
GitHub: [@Pratkashyap](https://github.com/Pratkashyap)

---

## License

MIT — see LICENSE for details.
