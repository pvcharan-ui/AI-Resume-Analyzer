# CareerPulse.ai — AI Resume Analysis & Job Application Assistant

CareerPulse.ai is an AI-powered web application that helps job seekers tailor their resumes and cover letters to specific job descriptions. It provides an estimated ATS score, keyword matching insights, a complete job-tailored resume, and a personalized cover letter.

🌐 **Live Demo:** https://ai-resume-analyzer-zeta-orcin-94.vercel.app/

📂 **GitHub Repository:** https://github.com/pvcharan-ui/AI-Resume-Analyzer

## ✨ Features

### 1. Tailored Cover Letter
- Generate a personalized cover letter using the company name, job description, experience level, and preferred tone.
- Supports multiple writing tones.
- Allows users to download the generated cover letter.

### 2. Complete Tailored Resume
- Generate a complete resume tailored to the target job description.
- Improve the professional summary and existing resume content.
- Organize relevant skills, projects, internships, education, and certifications.
- Preview and copy the generated resume.
- Download the resume in PDF and DOCX formats.

### 3. Keyword Match Analysis
- Extract important keywords from the job description.
- Identify skills and keywords already present in the resume.
- Display missing keywords separately.
- Recommend missing skills only when users genuinely possess them.

### 4. ATS Score Estimate
- Estimate resume compatibility on a scale of 0–100.
- Consider keyword matching, relevant skills, job-description alignment, resume relevance, and readability.
- Display a score breakdown and an explanation of the estimated result.

### 5. Resume Upload and Text Extraction
- Upload supported resume documents, including PDF and DOCX.
- Extract text from supported document formats.
- Allow users to provide resume text directly.
- Generate a draft from user-provided information when a current resume is not supplied.

## 🛠️ Technology Stack

**Frontend**
- React
- TypeScript
- Vite
- Tailwind CSS

**Backend**
- Node.js
- Express.js
- TypeScript

**AI Integration**
- Google Gemini API
- `@google/genai` SDK

**Document Processing and Export**
- `unpdf`
- `mammoth`
- PDF and DOCX generation libraries

**Deployment**
- Vercel — Frontend
- Render — Backend
- GitHub — Source code and version control

## 🏗️ System Architecture

```text
User
  |
  v
React + TypeScript Frontend
  |
  v
Express.js Backend API
  |
  v
Google Gemini API
  |
  v
Structured Analysis Result
  |
  v
ATS Score | Keyword Analysis
Tailored Resume | Cover Letter
```

The frontend collects the user's inputs and sends them to the backend. The backend communicates with the Gemini API and returns structured analysis results to the frontend.

The Gemini API key is stored on the backend and must never be exposed in frontend code.

## 🚀 Run the Project Locally

### Prerequisites
- Node.js and npm
- A Google Gemini API key

### 1. Clone the repository

```bash
git clone https://github.com/pvcharan-ui/AI-Resume-Analyzer.git
cd AI-Resume-Analyzer
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root using `.env.example` as a reference.

Add the required backend variables:

```env
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
```

Replace the placeholder with your own Gemini API key. Never share or commit this file.

### 4. Start the application

If the project scripts are available as configured:

```bash
npm run dev:full
```

This starts the frontend and backend together.

The local frontend is available at:

```text
http://localhost:5173
```

The backend health endpoint is:

```text
http://localhost:5000/api/health
```

Refer to `package.json` for the available scripts if your local setup differs.

## 🌍 Deployment

The application uses separate frontend and backend deployments.

**Frontend — Vercel**

https://ai-resume-analyzer-zeta-orcin-94.vercel.app/

**Backend — Render**

https://ai-resume-analyzer-orh1.onrender.com/

The frontend uses the deployed backend API endpoint configured through its environment variables.

The backend requires the `GEMINI_API_KEY` environment variable to perform AI-powered analysis.

## 🔐 Security and Privacy

- Never commit `.env` files, API keys, or other secrets to GitHub.
- Keep the Gemini API key on the backend.
- Do not upload personal resumes or private candidate information to a public repository.
- Review generated documents before sharing them with employers.

## 🛡️ Responsible AI and Limitations

- ATS scores are estimates and do not guarantee selection or interview calls.
- Results depend on the supplied resume, job description, and AI-generated analysis.
- Generated content should be reviewed for accuracy before use.
- The application is designed to avoid inventing qualifications, skills, achievements, or work experience.
- Missing keywords should not be added to a resume unless the candidate genuinely has the relevant skill or experience.
- Scanned PDFs without an extractable text layer may require the user to paste the resume text manually.

## 🎯 Project Objective

The objective of CareerPulse.ai is to make job-application preparation easier by combining resume analysis, keyword matching, ATS score estimation, and personalized document generation in one application.

## 👨‍💻 Developer

**P. V. Sree Charan Reddy**

GitHub: https://github.com/pvcharan-ui

---

*CareerPulse.ai — Prepare smarter. Apply with confidence.*
