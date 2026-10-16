import { jsPDF } from 'jspdf';
import {
  Document,
  Paragraph,
  TextRun,
  Packer,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
} from 'docx';
import type { TailoredResume, CoverLetterData } from '../types';

/**
 * Format a tailored resume into clean, ATS-compliant plain text.
 */
export function formatResumeToPlainText(resume: TailoredResume): string {
  const lines: string[] = [];

  // Header
  const header = resume.header;
  lines.push(header.fullName.toUpperCase());
  if (header.headline) lines.push(header.headline);

  const contactParts: string[] = [];
  if (header.email) contactParts.push(header.email);
  if (header.phone) contactParts.push(header.phone);
  if (header.location) contactParts.push(header.location);
  if (header.linkedin) contactParts.push(header.linkedin);
  if (header.github) contactParts.push(header.github);
  if (header.portfolioUrl) contactParts.push(header.portfolioUrl);
  if (contactParts.length > 0) lines.push(contactParts.join(' | '));
  lines.push('');

  // Summary
  if (resume.professionalSummary?.trim()) {
    lines.push('==================================================');
    lines.push('PROFESSIONAL SUMMARY');
    lines.push('==================================================');
    lines.push(resume.professionalSummary.trim());
    lines.push('');
  }

  // Skills
  if (resume.skills && resume.skills.length > 0) {
    lines.push('==================================================');
    lines.push('TECHNICAL SKILLS');
    lines.push('==================================================');
    resume.skills.forEach((cat) => {
      lines.push(`${cat.category}: ${cat.skills.join(', ')}`);
    });
    lines.push('');
  }

  // Experience
  if (resume.experience && resume.experience.length > 0) {
    lines.push('==================================================');
    lines.push('EXPERIENCE & INTERNSHIPS');
    lines.push('==================================================');
    resume.experience.forEach((exp) => {
      const dates = [exp.startDate, exp.endDate].filter(Boolean).join(' - ');
      const sub = [exp.company, exp.location, dates].filter(Boolean).join(' | ');
      lines.push(`${exp.role.toUpperCase()}`);
      if (sub) lines.push(sub);
      exp.bulletPoints.forEach((bp) => {
        lines.push(`• ${bp}`);
      });
      lines.push('');
    });
  }

  // Projects
  if (resume.projects && resume.projects.length > 0) {
    lines.push('==================================================');
    lines.push('KEY PROJECTS');
    lines.push('==================================================');
    resume.projects.forEach((proj) => {
      const tech = proj.technologies?.length ? ` [Tech: ${proj.technologies.join(', ')}]` : '';
      const link = proj.link ? ` (${proj.link})` : '';
      lines.push(`${proj.title}${tech}${link}`);
      proj.bulletPoints.forEach((bp) => {
        lines.push(`• ${bp}`);
      });
      lines.push('');
    });
  }

  // Education
  if (resume.education && resume.education.length > 0) {
    lines.push('==================================================');
    lines.push('EDUCATION');
    lines.push('==================================================');
    resume.education.forEach((edu) => {
      const degreeLine = [edu.degree, edu.fieldOfStudy].filter(Boolean).join(' in ');
      const meta = [edu.graduationDate, edu.gradeOrGpa].filter(Boolean).join(' | ');
      lines.push(`${degreeLine} - ${edu.institution}`);
      if (meta) lines.push(meta);
      if (edu.honors && edu.honors.length > 0) {
        lines.push(`Honors / Coursework: ${edu.honors.join(', ')}`);
      }
      lines.push('');
    });
  }

  // Certifications
  if (resume.certifications && resume.certifications.length > 0) {
    lines.push('==================================================');
    lines.push('CERTIFICATIONS');
    lines.push('==================================================');
    resume.certifications.forEach((cert) => {
      const details = [cert.issuer, cert.date].filter(Boolean).join(', ');
      lines.push(`• ${cert.name}${details ? ` - ${details}` : ''}`);
    });
    lines.push('');
  }

  // Additional sections
  if (resume.additionalSections && resume.additionalSections.length > 0) {
    resume.additionalSections.forEach((sec) => {
      lines.push('==================================================');
      lines.push(sec.title.toUpperCase());
      lines.push('==================================================');
      sec.items.forEach((it) => lines.push(`• ${it}`));
      lines.push('');
    });
  }

  return lines.join('\n').trim();
}

/**
 * Format a cover letter into clean text.
 */
export function formatCoverLetterToPlainText(cl: CoverLetterData): string {
  const parts: string[] = [];
  if (cl.dateStr) parts.push(cl.dateStr, '');
  if (cl.salutation) parts.push(cl.salutation, '');
  if (cl.openingParagraph) parts.push(cl.openingParagraph, '');
  if (cl.bodyParagraphs?.length) {
    cl.bodyParagraphs.forEach((p) => parts.push(p, ''));
  }
  if (cl.closingParagraph) parts.push(cl.closingParagraph, '');
  if (cl.signOff) parts.push(cl.signOff);
  if (cl.candidateName) parts.push(cl.candidateName);

  return parts.join('\n');
}

/**
 * Trigger browser file download from Blob.
 */
function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate and download an ATS-optimized, vector PDF resume using jsPDF.
 */
export function downloadResumeAsPdf(resume: TailoredResume, customFilename?: string): void {
  const doc = new jsPDF({
    unit: 'pt',
    format: 'letter',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 45;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  };

  // Helper for section headings
  const renderSectionHeader = (title: string) => {
    checkPageBreak(30);
    y += 10;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(20, 20, 20);
    doc.text(title.toUpperCase(), margin, y);

    // Subtle underline rule
    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.75);
    doc.line(margin, y + 3, pageWidth - margin, y + 3);
    y += 14;
  };

  // 1. Candidate Header
  const header = resume.header;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(17);
  doc.setTextColor(15, 23, 42);
  doc.text(header.fullName.toUpperCase(), pageWidth / 2, y, { align: 'center' });
  y += 16;

  if (header.headline) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10.5);
    doc.setTextColor(71, 85, 105);
    doc.text(header.headline, pageWidth / 2, y, { align: 'center' });
    y += 14;
  }

  const contactItems: string[] = [];
  if (header.email) contactItems.push(header.email);
  if (header.phone) contactItems.push(header.phone);
  if (header.location) contactItems.push(header.location);
  if (header.linkedin) contactItems.push(header.linkedin);
  if (header.github) contactItems.push(header.github);
  if (contactItems.length > 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(contactItems.join('  •  '), pageWidth / 2, y, { align: 'center' });
    y += 12;
  }

  // 2. Professional Summary
  if (resume.professionalSummary?.trim()) {
    renderSectionHeader('Professional Summary');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(30, 41, 59);
    const splitSummary = doc.splitTextToSize(resume.professionalSummary.trim(), contentWidth);
    checkPageBreak(splitSummary.length * 13);
    doc.text(splitSummary, margin, y);
    y += splitSummary.length * 13;
  }

  // 3. Technical Skills
  if (resume.skills && resume.skills.length > 0) {
    renderSectionHeader('Technical Skills');
    doc.setFontSize(9.5);
    resume.skills.forEach((cat) => {
      checkPageBreak(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 41, 59);
      const catPrefix = `${cat.category}: `;
      doc.text(catPrefix, margin, y);

      const prefixWidth = doc.getTextWidth(catPrefix);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      const skillText = cat.skills.join(', ');
      const splitSkills = doc.splitTextToSize(skillText, contentWidth - prefixWidth);

      doc.text(splitSkills[0], margin + prefixWidth, y);
      y += 13;

      for (let i = 1; i < splitSkills.length; i++) {
        checkPageBreak(13);
        doc.text(splitSkills[i], margin + 15, y);
        y += 13;
      }
    });
  }

  // 4. Experience & Internships
  if (resume.experience && resume.experience.length > 0) {
    renderSectionHeader('Experience & Internships');
    resume.experience.forEach((exp) => {
      checkPageBreak(30);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      doc.text(exp.role, margin, y);

      const dates = [exp.startDate, exp.endDate].filter(Boolean).join(' – ');
      if (dates) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);
        doc.text(dates, pageWidth - margin, y, { align: 'right' });
      }
      y += 12;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(51, 65, 85);
      const subInfo = [exp.company, exp.location].filter(Boolean).join(' | ');
      doc.text(subInfo, margin, y);
      y += 12;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(30, 41, 59);

      exp.bulletPoints.forEach((bp) => {
        const splitBp = doc.splitTextToSize(bp, contentWidth - 14);
        checkPageBreak(splitBp.length * 12 + 2);
        doc.text('•', margin + 2, y);
        doc.text(splitBp, margin + 12, y);
        y += splitBp.length * 12 + 2;
      });
      y += 4;
    });
  }

  // 5. Key Projects
  if (resume.projects && resume.projects.length > 0) {
    renderSectionHeader('Key Projects');
    resume.projects.forEach((proj) => {
      checkPageBreak(25);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      doc.text(proj.title, margin, y);

      if (proj.technologies && proj.technologies.length > 0) {
        const techStr = `Tools: ${proj.technologies.join(', ')}`;
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8.5);
        doc.setTextColor(100, 116, 139);
        doc.text(techStr, pageWidth - margin, y, { align: 'right' });
      }
      y += 12;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(30, 41, 59);

      proj.bulletPoints.forEach((bp) => {
        const splitBp = doc.splitTextToSize(bp, contentWidth - 14);
        checkPageBreak(splitBp.length * 12 + 2);
        doc.text('•', margin + 2, y);
        doc.text(splitBp, margin + 12, y);
        y += splitBp.length * 12 + 2;
      });
      y += 3;
    });
  }

  // 6. Education
  if (resume.education && resume.education.length > 0) {
    renderSectionHeader('Education');
    resume.education.forEach((edu) => {
      checkPageBreak(25);
      const degreeTitle = [edu.degree, edu.fieldOfStudy].filter(Boolean).join(' in ');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      doc.text(degreeTitle, margin, y);

      if (edu.graduationDate) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);
        doc.text(edu.graduationDate, pageWidth - margin, y, { align: 'right' });
      }
      y += 12;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);
      const meta = [edu.institution, edu.gradeOrGpa].filter(Boolean).join('  |  ');
      doc.text(meta, margin, y);
      y += 12;

      if (edu.honors && edu.honors.length > 0) {
        const honorsText = `Key Focus: ${edu.honors.join(', ')}`;
        const splitHonors = doc.splitTextToSize(honorsText, contentWidth - 10);
        checkPageBreak(splitHonors.length * 11);
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8.5);
        doc.setTextColor(100, 116, 139);
        doc.text(splitHonors, margin + 5, y);
        y += splitHonors.length * 11;
      }
      y += 3;
    });
  }

  // 7. Certifications
  if (resume.certifications && resume.certifications.length > 0) {
    renderSectionHeader('Certifications');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);

    resume.certifications.forEach((cert) => {
      checkPageBreak(13);
      const details = [cert.issuer, cert.date].filter(Boolean).join('  |  ');
      const text = `${cert.name}${details ? ` — ${details}` : ''}`;
      const splitCert = doc.splitTextToSize(text, contentWidth - 14);
      doc.text('•', margin + 2, y);
      doc.text(splitCert, margin + 12, y);
      y += splitCert.length * 12 + 2;
    });
  }

  // 8. Additional Sections
  if (resume.additionalSections && resume.additionalSections.length > 0) {
    resume.additionalSections.forEach((sec) => {
      renderSectionHeader(sec.title);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(30, 41, 59);
      sec.items.forEach((item) => {
        const splitItem = doc.splitTextToSize(item, contentWidth - 14);
        checkPageBreak(splitItem.length * 12 + 2);
        doc.text('•', margin + 2, y);
        doc.text(splitItem, margin + 12, y);
        y += splitItem.length * 12 + 2;
      });
    });
  }

  const cleanName = (header.fullName || 'Tailored').replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = customFilename || `${cleanName}_Tailored_Resume.pdf`;
  doc.save(filename);
}

/**
 * Generate and download an ATS-optimized, native Microsoft Word DOCX resume using docx.js.
 */
export async function downloadResumeAsDocx(resume: TailoredResume, customFilename?: string): Promise<void> {
  const children: Paragraph[] = [];
  const header = resume.header;

  // Header: Full Name
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: header.fullName.toUpperCase(),
          bold: true,
          size: 32, // 16pt
          font: 'Calibri',
          color: '0F172A',
        }),
      ],
    })
  );

  if (header.headline) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
        children: [
          new TextRun({
            text: header.headline,
            size: 22, // 11pt
            font: 'Calibri',
            color: '475569',
          }),
        ],
      })
    );
  }

  const contactList: string[] = [];
  if (header.email) contactList.push(header.email);
  if (header.phone) contactList.push(header.phone);
  if (header.location) contactList.push(header.location);
  if (header.linkedin) contactList.push(header.linkedin);
  if (header.github) contactList.push(header.github);

  if (contactList.length > 0) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 180 },
        children: [
          new TextRun({
            text: contactList.join('  •  '),
            size: 19, // 9.5pt
            font: 'Calibri',
            color: '64748B',
          }),
        ],
      })
    );
  }

  const createSectionHeader = (title: string): Paragraph => {
    return new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 80 },
      border: {
        bottom: {
          color: 'CBD5E1',
          space: 2,
          style: BorderStyle.SINGLE,
          size: 6,
        },
      },
      children: [
        new TextRun({
          text: title.toUpperCase(),
          bold: true,
          size: 23, // 11.5pt
          font: 'Calibri',
          color: '0F172A',
        }),
      ],
    });
  };

  // Professional Summary
  if (resume.professionalSummary?.trim()) {
    children.push(createSectionHeader('Professional Summary'));
    children.push(
      new Paragraph({
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: resume.professionalSummary.trim(),
            size: 21, // 10.5pt
            font: 'Calibri',
            color: '1E293B',
          }),
        ],
      })
    );
  }

  // Technical Skills
  if (resume.skills && resume.skills.length > 0) {
    children.push(createSectionHeader('Technical Skills'));
    resume.skills.forEach((cat) => {
      children.push(
        new Paragraph({
          spacing: { after: 40 },
          children: [
            new TextRun({
              text: `${cat.category}: `,
              bold: true,
              size: 21,
              font: 'Calibri',
              color: '0F172A',
            }),
            new TextRun({
              text: cat.skills.join(', '),
              size: 21,
              font: 'Calibri',
              color: '334155',
            }),
          ],
        })
      );
    });
  }

  // Experience
  if (resume.experience && resume.experience.length > 0) {
    children.push(createSectionHeader('Experience & Internships'));
    resume.experience.forEach((exp) => {
      const dates = [exp.startDate, exp.endDate].filter(Boolean).join(' – ');
      children.push(
        new Paragraph({
          spacing: { before: 80, after: 20 },
          children: [
            new TextRun({
              text: exp.role,
              bold: true,
              size: 22,
              font: 'Calibri',
              color: '0F172A',
            }),
            new TextRun({
              text: `  |  ${exp.company}`,
              size: 21,
              bold: true,
              font: 'Calibri',
              color: '334155',
            }),
            ...(exp.location
              ? [
                  new TextRun({
                    text: ` (${exp.location})`,
                    italics: true,
                    size: 20,
                    font: 'Calibri',
                    color: '64748B',
                  }),
                ]
              : []),
            ...(dates
              ? [
                  new TextRun({
                    text: `   [${dates}]`,
                    size: 20,
                    font: 'Calibri',
                    color: '64748B',
                  }),
                ]
              : []),
          ],
        })
      );

      exp.bulletPoints.forEach((bp) => {
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 30 },
            children: [
              new TextRun({
                text: bp,
                size: 20,
                font: 'Calibri',
                color: '1E293B',
              }),
            ],
          })
        );
      });
    });
  }

  // Key Projects
  if (resume.projects && resume.projects.length > 0) {
    children.push(createSectionHeader('Key Projects'));
    resume.projects.forEach((proj) => {
      const techText = proj.technologies?.length ? ` [${proj.technologies.join(', ')}]` : '';
      children.push(
        new Paragraph({
          spacing: { before: 80, after: 20 },
          children: [
            new TextRun({
              text: proj.title,
              bold: true,
              size: 22,
              font: 'Calibri',
              color: '0F172A',
            }),
            new TextRun({
              text: techText,
              italics: true,
              size: 19,
              font: 'Calibri',
              color: '64748B',
            }),
          ],
        })
      );

      proj.bulletPoints.forEach((bp) => {
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 30 },
            children: [
              new TextRun({
                text: bp,
                size: 20,
                font: 'Calibri',
                color: '1E293B',
              }),
            ],
          })
        );
      });
    });
  }

  // Education
  if (resume.education && resume.education.length > 0) {
    children.push(createSectionHeader('Education'));
    resume.education.forEach((edu) => {
      const degreeTitle = [edu.degree, edu.fieldOfStudy].filter(Boolean).join(' in ');
      const subInfo = [edu.institution, edu.graduationDate, edu.gradeOrGpa].filter(Boolean).join('  |  ');
      children.push(
        new Paragraph({
          spacing: { before: 60, after: 20 },
          children: [
            new TextRun({
              text: degreeTitle,
              bold: true,
              size: 21,
              font: 'Calibri',
              color: '0F172A',
            }),
            new TextRun({
              text: `  —  ${subInfo}`,
              size: 20,
              font: 'Calibri',
              color: '334155',
            }),
          ],
        })
      );
      if (edu.honors && edu.honors.length > 0) {
        children.push(
          new Paragraph({
            spacing: { after: 40 },
            children: [
              new TextRun({
                text: `Key Focus: ${edu.honors.join(', ')}`,
                italics: true,
                size: 19,
                font: 'Calibri',
                color: '64748B',
              }),
            ],
          })
        );
      }
    });
  }

  // Certifications
  if (resume.certifications && resume.certifications.length > 0) {
    children.push(createSectionHeader('Certifications'));
    resume.certifications.forEach((cert) => {
      const details = [cert.issuer, cert.date].filter(Boolean).join('  |  ');
      children.push(
        new Paragraph({
          bullet: { level: 0 },
          spacing: { after: 30 },
          children: [
            new TextRun({
              text: cert.name,
              bold: true,
              size: 20,
              font: 'Calibri',
              color: '0F172A',
            }),
            ...(details
              ? [
                  new TextRun({
                    text: ` — ${details}`,
                    size: 20,
                    font: 'Calibri',
                    color: '475569',
                  }),
                ]
              : []),
          ],
        })
      );
    });
  }

  // Additional sections
  if (resume.additionalSections && resume.additionalSections.length > 0) {
    resume.additionalSections.forEach((sec) => {
      children.push(createSectionHeader(sec.title));
      sec.items.forEach((item) => {
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 30 },
            children: [
              new TextRun({
                text: item,
                size: 20,
                font: 'Calibri',
                color: '1E293B',
              }),
            ],
          })
        );
      });
    });
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720, // 0.5 in
              right: 720,
              bottom: 720,
              left: 720,
            },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const cleanName = (header.fullName || 'Tailored').replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = customFilename || `${cleanName}_Tailored_Resume.docx`;
  triggerDownload(blob, filename);
}

/**
 * Generate and download Cover Letter as PDF.
 */
export function downloadCoverLetterAsPdf(cl: CoverLetterData, customFilename?: string): void {
  const doc = new jsPDF({
    unit: 'pt',
    format: 'letter',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 54; // 0.75 in
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  };

  // Header / Candidate name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  doc.text(cl.candidateName, margin, y);
  y += 18;

  // Date
  if (cl.dateStr) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(cl.dateStr, margin, y);
    y += 24;
  }

  // Company / Recipient
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(30, 41, 59);
  doc.text(`Hiring Team at ${cl.companyName}`, margin, y);
  y += 20;

  // Salutation
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text(cl.salutation, margin, y);
  y += 18;

  // Opening paragraph
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  const splitOpening = doc.splitTextToSize(cl.openingParagraph, contentWidth);
  checkPageBreak(splitOpening.length * 14 + 12);
  doc.text(splitOpening, margin, y);
  y += splitOpening.length * 14 + 12;

  // Body paragraphs
  cl.bodyParagraphs.forEach((para) => {
    const splitBody = doc.splitTextToSize(para, contentWidth);
    checkPageBreak(splitBody.length * 14 + 12);
    doc.text(splitBody, margin, y);
    y += splitBody.length * 14 + 12;
  });

  // Closing paragraph
  const splitClosing = doc.splitTextToSize(cl.closingParagraph, contentWidth);
  checkPageBreak(splitClosing.length * 14 + 20);
  doc.text(splitClosing, margin, y);
  y += splitClosing.length * 14 + 20;

  // Sign-off
  checkPageBreak(40);
  doc.text(cl.signOff, margin, y);
  y += 18;
  doc.setFont('helvetica', 'bold');
  doc.text(cl.candidateName, margin, y);

  const cleanCompany = (cl.companyName || 'Application').replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = customFilename || `Cover_Letter_${cleanCompany}.pdf`;
  doc.save(filename);
}

/**
 * Generate and download Cover Letter as Word DOCX.
 */
export async function downloadCoverLetterAsDocx(cl: CoverLetterData, customFilename?: string): Promise<void> {
  const children: Paragraph[] = [];

  // Candidate Name
  children.push(
    new Paragraph({
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: cl.candidateName,
          bold: true,
          size: 32, // 16pt
          font: 'Calibri',
          color: '0F172A',
        }),
      ],
    })
  );

  // Date
  if (cl.dateStr) {
    children.push(
      new Paragraph({
        spacing: { after: 180 },
        children: [
          new TextRun({
            text: cl.dateStr,
            size: 20,
            font: 'Calibri',
            color: '64748B',
          }),
        ],
      })
    );
  }

  // Recipient
  children.push(
    new Paragraph({
      spacing: { after: 140 },
      children: [
        new TextRun({
          text: `Hiring Team at ${cl.companyName}`,
          bold: true,
          size: 22,
          font: 'Calibri',
          color: '1E293B',
        }),
      ],
    })
  );

  // Salutation
  children.push(
    new Paragraph({
      spacing: { after: 140 },
      children: [
        new TextRun({
          text: cl.salutation,
          size: 21,
          font: 'Calibri',
          color: '0F172A',
        }),
      ],
    })
  );

  // Opening Paragraph
  children.push(
    new Paragraph({
      spacing: { after: 140 },
      children: [
        new TextRun({
          text: cl.openingParagraph,
          size: 21,
          font: 'Calibri',
          color: '1E293B',
        }),
      ],
    })
  );

  // Body Paragraphs
  cl.bodyParagraphs.forEach((para) => {
    children.push(
      new Paragraph({
        spacing: { after: 140 },
        children: [
          new TextRun({
            text: para,
            size: 21,
            font: 'Calibri',
            color: '1E293B',
          }),
        ],
      })
    );
  });

  // Closing Paragraph
  children.push(
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: cl.closingParagraph,
          size: 21,
          font: 'Calibri',
          color: '1E293B',
        }),
      ],
    })
  );

  // Sign-off
  children.push(
    new Paragraph({
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: cl.signOff,
          size: 21,
          font: 'Calibri',
          color: '1E293B',
        }),
      ],
    })
  );

  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: cl.candidateName,
          bold: true,
          size: 22,
          font: 'Calibri',
          color: '0F172A',
        }),
      ],
    })
  );

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1080, // 0.75 in
              right: 1080,
              bottom: 1080,
              left: 1080,
            },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const cleanCompany = (cl.companyName || 'Application').replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = customFilename || `Cover_Letter_${cleanCompany}.docx`;
  triggerDownload(blob, filename);
}
