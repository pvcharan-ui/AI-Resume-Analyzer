import { Type, type Schema } from '@google/genai';

/**
 * Strict JSON Schema matching the frontend AnalysisResult interface
 */
export const ANALYSIS_RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    atsScore: {
      type: Type.OBJECT,
      properties: {
        overallScore: { type: Type.INTEGER, description: 'Estimated ATS score from 0 to 100' },
        ratingTier: {
          type: Type.STRING,
          description: 'Rating tier: Excellent, Competitive, Average, Needs Optimization, or Needs Resume',
        },
        explanation: {
          type: Type.STRING,
          description: 'Concise explanation of why this ATS score was awarded and specific observations',
        },
        breakdown: {
          type: Type.OBJECT,
          properties: {
            keywordMatchScore: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                score: { type: Type.INTEGER },
                maxScore: { type: Type.INTEGER },
                description: { type: Type.STRING },
              },
              required: ['name', 'score', 'maxScore', 'description'],
            },
            skillsRelevanceScore: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                score: { type: Type.INTEGER },
                maxScore: { type: Type.INTEGER },
                description: { type: Type.STRING },
              },
              required: ['name', 'score', 'maxScore', 'description'],
            },
            jobAlignmentScore: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                score: { type: Type.INTEGER },
                maxScore: { type: Type.INTEGER },
                description: { type: Type.STRING },
              },
              required: ['name', 'score', 'maxScore', 'description'],
            },
            contentDepthScore: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                score: { type: Type.INTEGER },
                maxScore: { type: Type.INTEGER },
                description: { type: Type.STRING },
              },
              required: ['name', 'score', 'maxScore', 'description'],
            },
            readabilityScore: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                score: { type: Type.INTEGER },
                maxScore: { type: Type.INTEGER },
                description: { type: Type.STRING },
              },
              required: ['name', 'score', 'maxScore', 'description'],
            },
          },
          required: [
            'keywordMatchScore',
            'skillsRelevanceScore',
            'jobAlignmentScore',
            'contentDepthScore',
            'readabilityScore',
          ],
        },
        formattingHealth: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              item: { type: Type.STRING },
              status: { type: Type.STRING, description: 'passed, warning, or needs-improvement' },
              details: { type: Type.STRING },
            },
            required: ['item', 'status', 'details'],
          },
        },
        detectedIrrelevantContent: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
      },
      required: [
        'overallScore',
        'ratingTier',
        'explanation',
        'breakdown',
        'formattingHealth',
        'detectedIrrelevantContent',
      ],
    },
    keywordAnalysis: {
      type: Type.OBJECT,
      properties: {
        matchedKeywords: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              term: { type: Type.STRING },
              category: { type: Type.STRING, description: 'technical, tool, methodology, soft, or domain' },
              inJobDescription: { type: Type.BOOLEAN },
              inResume: { type: Type.BOOLEAN },
              frequencyInJD: { type: Type.INTEGER },
              importance: { type: Type.STRING, description: 'critical, important, or nice-to-have' },
            },
            required: ['term', 'category', 'inJobDescription', 'inResume', 'frequencyInJD', 'importance'],
          },
        },
        missingKeywords: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              term: { type: Type.STRING },
              category: { type: Type.STRING, description: 'technical, tool, methodology, soft, or domain' },
              inJobDescription: { type: Type.BOOLEAN },
              inResume: { type: Type.BOOLEAN },
              frequencyInJD: { type: Type.INTEGER },
              importance: { type: Type.STRING, description: 'critical, important, or nice-to-have' },
            },
            required: ['term', 'category', 'inJobDescription', 'inResume', 'frequencyInJD', 'importance'],
          },
        },
        matchRatePercentage: { type: Type.INTEGER },
        totalJdKeywords: { type: Type.INTEGER },
        matchedCount: { type: Type.INTEGER },
        missingCount: { type: Type.INTEGER },
      },
      required: [
        'matchedKeywords',
        'missingKeywords',
        'matchRatePercentage',
        'totalJdKeywords',
        'matchedCount',
        'missingCount',
      ],
    },
    tailoredResume: {
      type: Type.OBJECT,
      properties: {
        isDraftFromScratch: { type: Type.BOOLEAN },
        header: {
          type: Type.OBJECT,
          properties: {
            fullName: { type: Type.STRING },
            headline: { type: Type.STRING },
            email: { type: Type.STRING },
            phone: { type: Type.STRING },
            location: { type: Type.STRING },
            linkedin: { type: Type.STRING },
            github: { type: Type.STRING },
            portfolioUrl: { type: Type.STRING },
          },
          required: ['fullName'],
        },
        professionalSummary: { type: Type.STRING },
        skills: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING },
              skills: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['category', 'skills'],
          },
        },
        experience: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              company: { type: Type.STRING },
              role: { type: Type.STRING },
              location: { type: Type.STRING },
              startDate: { type: Type.STRING },
              endDate: { type: Type.STRING },
              bulletPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['company', 'role', 'bulletPoints'],
          },
        },
        projects: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              technologies: { type: Type.ARRAY, items: { type: Type.STRING } },
              link: { type: Type.STRING },
              bulletPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['title', 'bulletPoints'],
          },
        },
        education: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              institution: { type: Type.STRING },
              degree: { type: Type.STRING },
              fieldOfStudy: { type: Type.STRING },
              graduationDate: { type: Type.STRING },
              gradeOrGpa: { type: Type.STRING },
              honors: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['institution', 'degree'],
          },
        },
        certifications: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              issuer: { type: Type.STRING },
              date: { type: Type.STRING },
            },
            required: ['name'],
          },
        },
        additionalSections: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              items: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['title', 'items'],
          },
        },
      },
      required: [
        'isDraftFromScratch',
        'header',
        'professionalSummary',
        'skills',
        'experience',
        'projects',
        'education',
        'certifications',
        'additionalSections',
      ],
    },
    coverLetter: {
      type: Type.OBJECT,
      properties: {
        companyName: { type: Type.STRING },
        dateStr: { type: Type.STRING },
        salutation: { type: Type.STRING },
        openingParagraph: { type: Type.STRING },
        bodyParagraphs: { type: Type.ARRAY, items: { type: Type.STRING } },
        closingParagraph: { type: Type.STRING },
        signOff: { type: Type.STRING },
        candidateName: { type: Type.STRING },
        tone: { type: Type.STRING },
      },
      required: [
        'companyName',
        'dateStr',
        'salutation',
        'openingParagraph',
        'bodyParagraphs',
        'closingParagraph',
        'signOff',
        'candidateName',
        'tone',
      ],
    },
  },
  required: ['atsScore', 'keywordAnalysis', 'tailoredResume', 'coverLetter'],
};
