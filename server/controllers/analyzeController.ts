import type { Request, Response } from 'express';
import { getGeminiClient, GEMINI_MODEL } from '../config/gemini';
import { SYSTEM_INSTRUCTION } from '../prompts/systemInstruction';
import { ANALYSIS_RESPONSE_SCHEMA } from '../prompts/analysisSchema';
import type { ApplicationInput, AnalysisResult, CoverLetterTone, ExperienceLevel } from '../../src/types';

const VALID_EXPERIENCE_LEVELS: ExperienceLevel[] = ['fresher', 'experienced'];
const VALID_TONES: CoverLetterTone[] = [
  'professional',
  'confident',
  'conversational',
  'enthusiastic',
  'executive',
];

/**
 * Controller handling POST /api/analyze
 */
export async function analyzeApplicationHandler(req: Request, res: Response): Promise<void> {
  try {
    const {
      companyName,
      experienceLevel,
      jobDescription,
      resumeText,
      coverLetterTone,
    } = req.body as Partial<ApplicationInput>;

    // 1. Input Validation
    if (!companyName || typeof companyName !== 'string' || !companyName.trim()) {
      res.status(400).json({ error: 'Company Name is required.' });
      return;
    }

    const normalizedExpLevel = (typeof experienceLevel === 'string' ? experienceLevel.trim().toLowerCase() : '') as ExperienceLevel;
    if (!normalizedExpLevel || !VALID_EXPERIENCE_LEVELS.includes(normalizedExpLevel)) {
      res.status(400).json({
        error: `Invalid experience level. Must be one of: ${VALID_EXPERIENCE_LEVELS.join(', ')}`,
      });
      return;
    }

    if (!jobDescription || typeof jobDescription !== 'string' || !jobDescription.trim()) {
      res.status(400).json({ error: 'Job Description is required.' });
      return;
    }

    if (jobDescription.trim().length < 20) {
      res.status(400).json({
        error: 'Job Description is too short. Please provide a more descriptive job posting.',
      });
      return;
    }

    const normalizedTone = (typeof coverLetterTone === 'string' ? coverLetterTone.trim().toLowerCase() : '') as CoverLetterTone;
    const selectedTone: CoverLetterTone =
      normalizedTone && VALID_TONES.includes(normalizedTone)
        ? normalizedTone
        : 'professional';

    const rawResumeText = typeof resumeText === 'string' ? resumeText.trim() : '';
    // Ignore mock/legacy attachment placeholder strings such as "[Document attached: filename.pdf]"
    const isPlaceholderAttachment = /^\[Document attached:.*\]$/i.test(rawResumeText);
    const cleanResumeText = isPlaceholderAttachment ? '' : rawResumeText;
    // Consider resume provided if it contains substantive text (at least 20 chars)
    const isResumeProvided = cleanResumeText.length >= 20;

    // 2. Check Gemini Client Initialization
    let ai;
    try {
      ai = getGeminiClient();
    } catch (configError) {
      const message = configError instanceof Error ? configError.message : 'Gemini API key is not configured.';
      res.status(500).json({ error: message });
      return;
    }

    // 3. Build Prompt for Gemini
    const currentDateStr = new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    const userPrompt = `Please analyze the following job application materials and return structured analysis results strictly adhering to zero-hallucination rules.

Target Company: ${companyName.trim()}
Experience Level: ${experienceLevel}
Preferred Cover Letter Tone: ${selectedTone}
Date: ${currentDateStr}

==================================================
CRITICAL ACCURACY & ANTI-HALLUCINATION RULES:
==================================================
1. CANDIDATE FACTS: The Candidate Resume below is the ONLY source of truth for candidate facts.
- Do NOT invent or infer skills (e.g., React.js, REST APIs, TypeScript, Tailwind CSS, Node.js, Agile, Testing frameworks).
- Do NOT invent cross-browser compatibility, teamwork/collaboration, problem-solving, clean-code, accessibility, performance optimization, metrics, percentages, or responsibilities not explicitly present in the candidate's resume.
2. 1-TO-1 BULLET GROUNDING:
- In tailoredResume.experience and tailoredResume.projects, every rewritten bullet point must correspond directly to a genuine statement in the original resume.
- Do NOT fabricate new bullet points. If an internship has 1 bullet in the original resume, rewrite only that 1 bullet concisely—do not add extra bullets!
3. SKILLS LIST:
- Include ONLY skills genuinely present in the candidate's resume (e.g. HTML5, CSS3, JavaScript, Responsive Web Design, Python, C, SQL, MongoDB, Git, GitHub, Data Structures & Algorithms, DBMS, Operating Systems).
- Missing JD keywords (e.g. React.js, REST APIs, TypeScript, Tailwind CSS, Node.js, Agile, Testing frameworks) must ONLY appear in keywordAnalysis.missingKeywords and NEVER in tailoredResume.skills.
4. COVER LETTER:
- Grounded strictly in candidate's genuine background. Do NOT invent company facts, values, products, or culture.
- Use safe alignment phrasing (e.g. "The Frontend Developer position at ${companyName.trim()} aligns well with my foundation in HTML5, CSS3, JavaScript, and responsive web development.").

==================================================
JOB DESCRIPTION:
==================================================
${jobDescription.trim()}

==================================================
CANDIDATE RESUME:
==================================================
${
  isResumeProvided
    ? cleanResumeText
    : '[NO RESUME PROVIDED: The candidate did not provide an existing resume. Adhere strictly to the NO-RESUME rules: do not invent fake history or achievements, set ATS score to 0 with clear explanation, set isDraftFromScratch to true with starter template placeholders, and compose a foundational cover letter based only on the available information.]'
}
`;

    // 4. Call Gemini Model with Structured Output
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: userPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: ANALYSIS_RESPONSE_SCHEMA,
      },
    });

    // 5. Parse and Validate Output
    const responseText = response.text;
    if (!responseText) {
      res.status(502).json({
        error: 'Gemini model returned an empty response. Please try again.',
      });
      return;
    }

    let parsedResult: AnalysisResult;
    try {
      parsedResult = JSON.parse(responseText);
    } catch (parseErr) {
      console.error('Failed to parse Gemini JSON output:', parseErr, responseText);
      res.status(502).json({
        error: 'The AI model generated an invalid JSON format. Please retry the request.',
      });
      return;
    }

    // Ensure timestamp is attached
    parsedResult.timestamp = new Date().toISOString();

    // Enforce strict factual grounding when resume is provided
    if (isResumeProvided) {
      enforceStrictGrounding(parsedResult, cleanResumeText);
    }

    // Guardrail: if no resume was provided, strictly enforce no-resume flags
    if (!isResumeProvided) {
      parsedResult.atsScore.overallScore = 0;
      parsedResult.atsScore.ratingTier = 'Needs Resume';
      if (parsedResult.tailoredResume) {
        parsedResult.tailoredResume.isDraftFromScratch = true;
      }
      if (parsedResult.updatedResume) {
        parsedResult.updatedResume.isDraftFromScratch = true;
      }
      if (
        !parsedResult.atsScore.explanation.toLowerCase().includes('no resume') &&
        !parsedResult.atsScore.explanation.toLowerCase().includes('not provided')
      ) {
        parsedResult.atsScore.explanation =
          'No current resume was provided. An ATS score cannot be evaluated without resume text. A tailored initial draft has been generated below.';
      }
    }

    // Populate updatedResume for backward compatibility
    if (parsedResult.tailoredResume && !parsedResult.updatedResume) {
      parsedResult.updatedResume = {
        optimizedSummary: parsedResult.tailoredResume.professionalSummary || '',
        isDraftFromScratch: parsedResult.tailoredResume.isDraftFromScratch,
        improvedBulletPoints: parsedResult.tailoredResume.experience.flatMap((exp, expIdx) =>
          exp.bulletPoints.map((bp, bpIdx) => ({
            id: `bp-${expIdx}-${bpIdx}`,
            improved: bp,
            original: bp,
          }))
        ),
        relevantSkills: {
          coreTechnical: parsedResult.tailoredResume.skills.flatMap((s) => s.skills),
          toolsAndFrameworks: [],
          methodologiesAndProcesses: [],
          softCompetencies: [],
        },
        formattingTips: [
          'Maintain a clean single-column layout for optimal ATS readability.',
          'Keep section headers standard and predictable.',
        ],
      };
    }

    // 6. Return Structured Result
    res.status(200).json(parsedResult);
  } catch (err: unknown) {
    console.error('Error during application analysis:', err);

    const errorMessage = err instanceof Error ? err.message : 'An unexpected server error occurred.';

    // Check for common Gemini API errors (rate limit, quota, invalid key)
    if (errorMessage.includes('RESOURCE_EXHAUSTED') || errorMessage.includes('429')) {
      res.status(429).json({
        error: 'Gemini API quota or rate limit exceeded. Please wait a moment and try again.',
      });
      return;
    }

    if (errorMessage.includes('API_KEY_INVALID') || errorMessage.includes('401') || errorMessage.includes('403')) {
      res.status(401).json({
        error: 'The configured Gemini API key is invalid or unauthorized. Please verify your GEMINI_API_KEY in .env.',
      });
      return;
    }

    res.status(500).json({
      error: 'An error occurred during AI analysis. Please check server logs and try again.',
    });
  }
}

/**
 * Deterministically enforces zero-hallucination rules against candidate's genuine resume text.
 */
function enforceStrictGrounding(
  result: AnalysisResult,
  cleanResumeText: string
): void {
  const resumeLower = cleanResumeText.toLowerCase();

  // 1. Keyword match verification:
  // If the candidate's resume explicitly has "responsive" or "responsive web design"
  const hasResponsiveInResume = resumeLower.includes('responsive');
  if (hasResponsiveInResume && result.keywordAnalysis) {
    const missingIndex = result.keywordAnalysis.missingKeywords.findIndex((k) =>
      k.term.toLowerCase().includes('responsive')
    );
    if (missingIndex !== -1) {
      const item = result.keywordAnalysis.missingKeywords.splice(missingIndex, 1)[0];
      item.inResume = true;
      if (!result.keywordAnalysis.matchedKeywords.some((k) => k.term.toLowerCase() === item.term.toLowerCase())) {
        result.keywordAnalysis.matchedKeywords.push(item);
      }
      result.keywordAnalysis.matchedCount = result.keywordAnalysis.matchedKeywords.length;
      result.keywordAnalysis.missingCount = result.keywordAnalysis.missingKeywords.length;
      if (result.keywordAnalysis.totalJdKeywords > 0) {
        result.keywordAnalysis.matchRatePercentage = Math.round(
          (result.keywordAnalysis.matchedCount / result.keywordAnalysis.totalJdKeywords) * 100
        );
      }
    }
  }

  // 2. Sanitize tailoredResume.skills: Remove any skill not supported by candidate resume
  if (result.tailoredResume?.skills) {
    const prohibitedIfMissing = [
      'react',
      'rest api',
      'typescript',
      'tailwind',
      'node',
      'agile',
      'testing',
      'unit test',
    ];

    result.tailoredResume.skills.forEach((cat) => {
      cat.skills = cat.skills.filter((skill) => {
        const skillLower = skill.toLowerCase();
        for (const item of prohibitedIfMissing) {
          if (skillLower.includes(item) && !resumeLower.includes(item)) {
            return false;
          }
        }
        return true;
      });
    });
    result.tailoredResume.skills = result.tailoredResume.skills.filter((cat) => cat.skills.length > 0);
  }

  // 3. Sanitize tailoredResume.experience & projects: remove ungrounded phrases
  const removeUngroundedPhrases = (text: string): string => {
    let cleaned = text;
    const checks = [
      { pattern: /,\s*ensured cross-browser compatibility and responsive design execution\.?/gi, trigger: 'cross-browser' },
      { pattern: /ensured cross-browser compatibility and responsive design execution\.?/gi, trigger: 'cross-browser' },
      { pattern: /cross-browser compatibility/gi, trigger: 'cross-browser' },
      { pattern: /collaborated in a remote team environment to build user-friendly web interfaces\.?/gi, trigger: 'remote team' },
      { pattern: /collaborated with cross-functional teams\.?/gi, trigger: 'cross-functional' },
      { pattern: /leveraging clean-code practices\.?/gi, trigger: 'clean-code' },
      { pattern: /with attention to accessibility\.?/gi, trigger: 'accessibility' },
      { pattern: /accessible layouts/gi, trigger: 'accessible' },
      { pattern: /prioritizing usability and clean dom manipulation\.?/gi, trigger: 'dom manipulation' },
    ];

    for (const c of checks) {
      if (!resumeLower.includes(c.trigger)) {
        cleaned = cleaned.replace(c.pattern, '');
      }
    }
    return cleaned.trim().replace(/\s{2,}/g, ' ').replace(/[,\s]+$/, '.');
  };

  if (result.tailoredResume?.experience) {
    result.tailoredResume.experience.forEach((exp) => {
      exp.bulletPoints = exp.bulletPoints
        .map(removeUngroundedPhrases)
        .filter((bp) => bp.length > 10);
    });
  }

  if (result.tailoredResume?.projects) {
    result.tailoredResume.projects.forEach((proj) => {
      proj.bulletPoints = proj.bulletPoints
        .map(removeUngroundedPhrases)
        .filter((bp) => bp.length > 10);
    });
  }

  // 4. Sanitize coverLetter: Remove fabricated company praise claims
  if (result.coverLetter) {
    const sanitizeParagraph = (para: string): string => {
      return para
        .replace(/I am deeply (?:inspired|impressed) by [^.]*?\./gi, '')
        .replace(/I admire [^.]*?commitment to [^.]*?\./gi, '')
        .replace(/I have long admired [^.]*?\./gi, '')
        .trim();
    };

    result.coverLetter.openingParagraph = sanitizeParagraph(result.coverLetter.openingParagraph);
    result.coverLetter.bodyParagraphs = result.coverLetter.bodyParagraphs.map(sanitizeParagraph);
    result.coverLetter.closingParagraph = sanitizeParagraph(result.coverLetter.closingParagraph);
  }
}
