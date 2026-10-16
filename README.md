# CareerPulse AI — Resume Analysis & Job Application Assistant

A modern, professional web application designed to analyze resumes against job descriptions, evaluate ATS compatibility, and generate personalized cover letters and updated resume content.

---

## 🌟 Core Requirements

### 1. Tailored Cover Letter
- **User Inputs**:
  - Company Name
  - Experience Level: Fresher / Experienced
  - Job Description
  - Current Resume (optional)
  - Preferred Cover Letter Tone
- **Tone Options**: Professional & Direct, Confident & Impact-Driven, Conversational & Warm, Enthusiastic & Dynamic, Executive & Strategic.
- Generates a personalized cover letter addressed to the company, utilizing the job description and candidate information.

### 2. Updated Resume Content
- Based on the job description and current resume, provides:
  - Optimized resume summary
  - Improved resume bullet points
  - Relevant skills
  - Concise, achievement-focused, and ATS-friendly content
- If no current resume is provided, creates a resume content draft based on the information provided by the user.
- Adheres strictly to genuine user data without inventing unverified credentials.

### 3. Keyword Match Analysis
- Extracts essential keywords from the job description.
- Evaluates whether those keywords exist in the resume.
- Displays matched keywords and missing keywords.
- Clearly recommends adding a missing keyword only if the user genuinely has that skill or experience.

### 4. ATS Score Estimate
- Computes an estimated ATS score from 0–100 by comparing the resume against the job description.
- Considers keyword matching, relevant skills, job-description alignment, content relevance, formatting/readability issues, and irrelevant content.
- Accompanied by a clear explanation of why the score was given.

---

## 🏗️ Project Architecture

```
src/
├── types/
│   └── index.ts                 # TypeScript type definitions
├── services/
│   ├── tones.ts                 # Cover letter tone definitions
│   └── api.ts                   # Backend AI / Gemini API integration service
├── components/
│   ├── common/
│   │   ├── Badge.tsx            # Status and category badges
│   │   ├── Toast.tsx            # Notification alerts
│   │   ├── LoadingState.tsx     # Animated analysis progress state
│   │   └── EmptyState.tsx       # Landing overview cards
│   ├── layout/
│   │   ├── Navbar.tsx           # Application navigation
│   │   └── Footer.tsx           # Application footer
│   ├── input/
│   │   ├── ApplicationForm.tsx  # Primary form coordinator
│   │   ├── CompanyAndToneSelector.tsx # Company, experience level, and tone inputs
│   │   ├── ResumeUploader.tsx   # File upload and text paste area
│   │   └── JobDescriptionInput.tsx # Job description textarea
│   └── analysis/
│       ├── AnalysisDashboard.tsx # Results tab controller
│       ├── AtsScoreMeter.tsx    # ATS score gauge, breakdown, & diagnostics
│       ├── KeywordMatchView.tsx # Matched and missing keywords
│       ├── UpdatedResumeView.tsx # Updated resume content (summary, bullets, skills)
│       └── CoverLetterView.tsx  # Tailored cover letter preview and export
└── App.tsx                      # Root state coordinator
```

---

## 🚀 Running the Project

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev

# 3. Build for production
npm run build

# 4. Run linter
npm run lint
```
