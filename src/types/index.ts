export type ExperienceLevel = 'fresher' | 'experienced';

export type CoverLetterTone = 
  | 'professional' 
  | 'confident' 
  | 'conversational' 
  | 'enthusiastic' 
  | 'executive';

export interface ToneOption {
  id: CoverLetterTone;
  label: string;
  tagline: string;
  description: string;
  iconName: string;
}

export interface ApplicationInput {
  companyName: string;
  experienceLevel: ExperienceLevel;
  jobDescription: string;
  resumeText: string;
  resumeFileName?: string;
  coverLetterTone: CoverLetterTone;
}

export interface KeywordItem {
  term: string;
  category: 'technical' | 'tool' | 'methodology' | 'soft' | 'domain';
  inJobDescription: boolean;
  inResume: boolean;
  frequencyInJD: number;
  importance: 'critical' | 'important' | 'nice-to-have';
}

export interface KeywordAnalysis {
  matchedKeywords: KeywordItem[];
  missingKeywords: KeywordItem[];
  matchRatePercentage: number;
  totalJdKeywords: number;
  matchedCount: number;
  missingCount: number;
}

export interface AtsSubScore {
  name: string;
  score: number;
  maxScore: number;
  description: string;
}

export interface AtsFormattingCheck {
  item: string;
  status: 'passed' | 'warning' | 'needs-improvement';
  details: string;
}

export interface AtsScoreAnalysis {
  overallScore: number; // 0 - 100
  ratingTier: string;
  explanation: string;
  breakdown: {
    keywordMatchScore: AtsSubScore;
    skillsRelevanceScore: AtsSubScore;
    jobAlignmentScore: AtsSubScore;
    contentDepthScore: AtsSubScore;
    readabilityScore: AtsSubScore;
  };
  formattingHealth: AtsFormattingCheck[];
  detectedIrrelevantContent: string[];
}

export interface BulletPointImprovement {
  id: string;
  original?: string;
  improved: string;
  actionVerb?: string;
  quantifiedMetric?: string;
  impactReason?: string;
}

export interface CategorizedSkills {
  coreTechnical: string[];
  toolsAndFrameworks: string[];
  methodologiesAndProcesses: string[];
  softCompetencies: string[];
}

export interface UpdatedResumeContent {
  optimizedSummary: string;
  isDraftFromScratch: boolean; // true if user provided no resume
  improvedBulletPoints: BulletPointImprovement[];
  relevantSkills: CategorizedSkills;
  formattingTips: string[];
}

export interface CoverLetterData {
  companyName: string;
  dateStr: string;
  salutation: string;
  openingParagraph: string;
  bodyParagraphs: string[];
  closingParagraph: string;
  signOff: string;
  candidateName: string;
  tone: CoverLetterTone;
}

export interface ResumeHeader {
  fullName: string;
  headline?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  portfolioUrl?: string;
}

export interface ResumeSkillCategory {
  category: string;
  skills: string[];
}

export interface ResumeExperienceItem {
  company: string;
  role: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  bulletPoints: string[];
}

export interface ResumeProjectItem {
  title: string;
  technologies: string[];
  link?: string;
  bulletPoints: string[];
}

export interface ResumeEducationItem {
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  graduationDate?: string;
  gradeOrGpa?: string;
  honors?: string[];
}

export interface ResumeCertificationItem {
  name: string;
  issuer?: string;
  date?: string;
}

export interface ResumeAdditionalSection {
  title: string;
  items: string[];
}

export interface TailoredResume {
  isDraftFromScratch: boolean;
  header: ResumeHeader;
  professionalSummary: string;
  skills: ResumeSkillCategory[];
  experience: ResumeExperienceItem[];
  projects: ResumeProjectItem[];
  education: ResumeEducationItem[];
  certifications: ResumeCertificationItem[];
  additionalSections: ResumeAdditionalSection[];
}

export interface AnalysisResult {
  atsScore: AtsScoreAnalysis;
  keywordAnalysis: KeywordAnalysis;
  tailoredResume: TailoredResume;
  updatedResume?: UpdatedResumeContent;
  coverLetter: CoverLetterData;
  timestamp: string;
}

export type AnalysisStatus = 'idle' | 'analyzing' | 'completed' | 'error';
