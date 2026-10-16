// Dynamic imports used to keep initial page bundle ultra-light

export interface DocumentExtractionResult {
  text: string;
  wordCount: number;
  fileName: string;
  pageCount?: number;
}

/**
 * Clean and normalize extracted resume text while preserving line breaks and structural readability.
 */
function cleanExtractedText(rawText: string): string {
  if (!rawText) return '';

  return (
    rawText
      // Normalize Windows / Mac carriage returns to standard newline
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      // Replace multiple trailing spaces on lines
      .replace(/[ \t]+$/gm, '')
      // Replace 3 or more consecutive newlines with 2 newlines (preserve paragraph spacing)
      .replace(/\n{3,}/g, '\n\n')
      // Replace non-breaking spaces and unusual whitespace with standard space
      .replace(/[\u00A0\u1680\u180E\u2000-\u200B\u202F\u205F\u3000\uFEFF]/g, ' ')
      .trim()
  );
}

/**
 * Calculates word count based on whitespace separation.
 */
export function getWordCount(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).filter(Boolean).length;
}

/**
 * Extracts text from an uploaded resume file (.pdf, .docx, .txt, .md).
 * Executes completely locally in-memory inside the browser/runtime.
 */
export async function extractResumeText(file: File): Promise<DocumentExtractionResult> {
  if (!file) {
    throw new Error('No file provided for text extraction.');
  }

  const ext = file.name.split('.').pop()?.toLowerCase();
  let extractedRaw = '';
  let pageCount: number | undefined;

  switch (ext) {
    case 'pdf': {
      try {
        const { extractText } = await import('unpdf');
        const arrayBuffer = await file.arrayBuffer();
        const uint8 = new Uint8Array(arrayBuffer);
        const pdfResult = await extractText(uint8, { mergePages: true });

        pageCount = pdfResult.totalPages;
        // pdfResult.text can be an array of strings or a single merged string depending on options
        if (Array.isArray(pdfResult.text)) {
          extractedRaw = pdfResult.text.join('\n\n');
        } else if (typeof pdfResult.text === 'string') {
          extractedRaw = pdfResult.text;
        } else {
          extractedRaw = '';
        }
      } catch (err: unknown) {
        console.error('PDF extraction failed:', err);
        throw new Error(
          'Failed to parse the PDF document. Please verify the file is not corrupted, or paste your resume text directly.'
        );
      }
      break;
    }

    case 'docx': {
      try {
        const mammothModule = await import('mammoth');
        const mammoth = mammothModule.default || mammothModule;
        const arrayBuffer = await file.arrayBuffer();
        const docxResult = await mammoth.extractRawText({ arrayBuffer });
        extractedRaw = docxResult.value || '';
      } catch (err: unknown) {
        console.error('DOCX extraction failed:', err);
        throw new Error(
          'Failed to parse the Word (.docx) document. Please paste your resume text directly into the editor.'
        );
      }
      break;
    }

    case 'txt':
    case 'md': {
      try {
        extractedRaw = await file.text();
      } catch (err: unknown) {
        console.error('Text file read failed:', err);
        throw new Error('Failed to read the text file. Please paste your resume text directly.');
      }
      break;
    }

    default:
      throw new Error(
        `Unsupported file type (.${ext || 'unknown'}). Please upload a PDF, DOCX, TXT, or Markdown resume.`
      );
  }

  const cleanedText = cleanExtractedText(extractedRaw);
  const wordCount = getWordCount(cleanedText);

  // If text is suspiciously empty or negligible (scanned image / non-text PDF)
  if (wordCount < 10) {
    throw new Error(
      `No readable text could be extracted from "${file.name}" (only ${wordCount} words detected). If this is a scanned or image-based document, please copy and paste your resume text directly into the "Paste Text" tab.`
    );
  }

  return {
    text: cleanedText,
    wordCount,
    fileName: file.name,
    pageCount,
  };
}
