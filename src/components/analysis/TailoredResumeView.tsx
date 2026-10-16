import { useState } from 'react';
import {
  Copy,
  Check,
  FileDown,
  FileText,
  Mail,
  Phone,
  MapPin,
  Link2,
  Globe,
  Loader2,
} from 'lucide-react';
import type { TailoredResume } from '../../types';
import {
  formatResumeToPlainText,
  downloadResumeAsPdf,
  downloadResumeAsDocx,
} from '../../services/documentExporter';

interface TailoredResumeViewProps {
  tailoredResume: TailoredResume;
  onToast: (title: string, message?: string, type?: 'success' | 'info') => void;
}

export const TailoredResumeView: React.FC<TailoredResumeViewProps> = ({
  tailoredResume,
  onToast,
}) => {
  const [copied, setCopied] = useState(false);
  const [isExportingDocx, setIsExportingDocx] = useState(false);

  const {
    header,
    professionalSummary,
    skills,
    experience,
    projects,
    education,
    certifications,
    additionalSections,
    isDraftFromScratch,
  } = tailoredResume;

  const handleCopy = async () => {
    try {
      const text = formatResumeToPlainText(tailoredResume);
      await navigator.clipboard.writeText(text);
      setCopied(true);
      onToast('Resume Copied', 'Clean ATS-friendly text copied to clipboard', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy resume:', err);
      onToast('Copy Failed', 'Please try again', 'info');
    }
  };

  const handleDownloadPdf = () => {
    try {
      downloadResumeAsPdf(tailoredResume);
      onToast('PDF Downloaded', 'ATS-compliant vector PDF ready', 'success');
    } catch (err) {
      console.error('PDF export error:', err);
      onToast('Export Failed', 'Could not generate PDF', 'info');
    }
  };

  const handleDownloadDocx = async () => {
    setIsExportingDocx(true);
    try {
      await downloadResumeAsDocx(tailoredResume);
      onToast('DOCX Downloaded', 'Editable Word document ready', 'success');
    } catch (err) {
      console.error('DOCX export error:', err);
      onToast('Export Failed', 'Could not generate DOCX', 'info');
    } finally {
      setIsExportingDocx(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Action Controls */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Tailored Resume
            </span>
            {isDraftFromScratch && (
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                Draft (Created without master resume)
              </span>
            )}
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            Tailored Resume
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Complete resume tailored to this job using only your genuine experience and skills.
          </p>
        </div>

        {/* Action Buttons: Copy, Download PDF, Download DOCX */}
        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto shrink-0">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors shadow-sm"
            title="Copy plain text resume to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-cyan-400" />
                <span>Copy Resume</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadPdf}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-all shadow-md shadow-cyan-600/20"
            title="Download ATS-optimized PDF"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>

          <button
            onClick={handleDownloadDocx}
            disabled={isExportingDocx}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/20"
            title="Download editable Microsoft Word document (.docx)"
          >
            {isExportingDocx ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <FileText className="w-3.5 h-3.5" />
            )}
            <span>Download DOCX</span>
          </button>
        </div>
      </div>

      {/* Realistic ATS Resume Document Preview */}
      <div className="bg-slate-900/40 border border-slate-800 p-4 sm:p-8 rounded-3xl backdrop-blur-sm">
        <div className="max-w-3xl mx-auto bg-white text-slate-900 rounded-2xl shadow-2xl p-6 sm:p-10 md:p-12 font-sans selection:bg-cyan-200 selection:text-slate-900 border border-slate-200">
          {/* Document Header */}
          <div className="text-center pb-5 border-b border-slate-300">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950 uppercase">
              {header.fullName || 'Candidate Name'}
            </h1>
            {header.headline && (
              <p className="text-sm font-semibold text-slate-700 mt-1">
                {header.headline}
              </p>
            )}

            {/* Contact Row */}
            <div className="flex flex-wrap items-center justify-center gap-y-1 gap-x-3 text-xs text-slate-600 mt-2.5">
              {header.email && (
                <span className="inline-flex items-center gap-1">
                  <Mail className="w-3 h-3 text-slate-500" />
                  <a href={`mailto:${header.email}`} className="hover:underline">
                    {header.email}
                  </a>
                </span>
              )}
              {header.phone && (
                <span className="inline-flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-500" />
                  <span>{header.phone}</span>
                </span>
              )}
              {header.location && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  <span>{header.location}</span>
                </span>
              )}
              {header.linkedin && (
                <span className="inline-flex items-center gap-1">
                  <Link2 className="w-3 h-3 text-slate-500" />
                  <span>{header.linkedin}</span>
                </span>
              )}
              {header.github && (
                <span className="inline-flex items-center gap-1">
                  <Link2 className="w-3 h-3 text-slate-500" />
                  <span>{header.github}</span>
                </span>
              )}
              {header.portfolioUrl && (
                <span className="inline-flex items-center gap-1">
                  <Globe className="w-3 h-3 text-slate-500" />
                  <span>{header.portfolioUrl}</span>
                </span>
              )}
            </div>
          </div>

          <div className="space-y-6 pt-5">
            {/* Section: Professional Summary */}
            {professionalSummary && (
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 border-b border-slate-300 mb-2">
                  Professional Summary
                </h2>
                <p className="text-xs leading-relaxed text-slate-800 text-justify">
                  {professionalSummary}
                </p>
              </div>
            )}

            {/* Section: Technical Skills */}
            {skills && skills.length > 0 && (
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 border-b border-slate-300 mb-2">
                  Technical Skills
                </h2>
                <div className="space-y-1.5 text-xs text-slate-800">
                  {skills.map((cat, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:gap-2">
                      <span className="font-bold text-slate-950 sm:w-44 shrink-0">
                        {cat.category}:
                      </span>
                      <span className="text-slate-700">
                        {cat.skills.join(', ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section: Experience & Internships */}
            {experience && experience.length > 0 && (
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 border-b border-slate-300 mb-3">
                  Experience & Internships
                </h2>
                <div className="space-y-4">
                  {experience.map((exp, idx) => {
                    const dates = [exp.startDate, exp.endDate].filter(Boolean).join(' – ');
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                          <div className="flex flex-wrap items-baseline gap-1.5">
                            <span className="text-xs font-bold text-slate-950">
                              {exp.role}
                            </span>
                            <span className="text-xs text-slate-600">|</span>
                            <span className="text-xs font-semibold text-slate-800">
                              {exp.company}
                            </span>
                            {exp.location && (
                              <span className="text-xs text-slate-500 italic">
                                ({exp.location})
                              </span>
                            )}
                          </div>
                          {dates && (
                            <span className="text-[11px] font-medium text-slate-500 shrink-0">
                              {dates}
                            </span>
                          )}
                        </div>
                        <ul className="list-disc list-outside pl-4 space-y-1 text-xs text-slate-700 leading-relaxed">
                          {exp.bulletPoints.map((bp, bpIdx) => (
                            <li key={bpIdx}>{bp}</li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Section: Key Projects */}
            {projects && projects.length > 0 && (
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 border-b border-slate-300 mb-3">
                  Key Projects
                </h2>
                <div className="space-y-3.5">
                  {projects.map((proj, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                        <div className="flex flex-wrap items-baseline gap-1.5">
                          <span className="text-xs font-bold text-slate-950">
                            {proj.title}
                          </span>
                          {proj.link && (
                            <span className="text-[11px] text-cyan-700 underline">
                              ({proj.link})
                            </span>
                          )}
                        </div>
                        {proj.technologies && proj.technologies.length > 0 && (
                          <span className="text-[11px] font-medium text-slate-500 italic">
                            Tech: {proj.technologies.join(', ')}
                          </span>
                        )}
                      </div>
                      <ul className="list-disc list-outside pl-4 space-y-1 text-xs text-slate-700 leading-relaxed">
                        {proj.bulletPoints.map((bp, bpIdx) => (
                          <li key={bpIdx}>{bp}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section: Education */}
            {education && education.length > 0 && (
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 border-b border-slate-300 mb-2.5">
                  Education
                </h2>
                <div className="space-y-2.5">
                  {education.map((edu, idx) => {
                    const degreeTitle = [edu.degree, edu.fieldOfStudy].filter(Boolean).join(' in ');
                    return (
                      <div key={idx} className="space-y-0.5">
                        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                          <div className="flex flex-wrap items-baseline gap-1.5">
                            <span className="text-xs font-bold text-slate-950">
                              {degreeTitle}
                            </span>
                            <span className="text-xs text-slate-600">—</span>
                            <span className="text-xs font-semibold text-slate-800">
                              {edu.institution}
                            </span>
                            {edu.gradeOrGpa && (
                              <span className="text-xs text-slate-600 font-mono">
                                ({edu.gradeOrGpa})
                              </span>
                            )}
                          </div>
                          {edu.graduationDate && (
                            <span className="text-[11px] font-medium text-slate-500">
                              {edu.graduationDate}
                            </span>
                          )}
                        </div>
                        {edu.honors && edu.honors.length > 0 && (
                          <p className="text-[11px] text-slate-600 italic pl-1">
                            Relevant Coursework / Focus: {edu.honors.join(', ')}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Section: Certifications */}
            {certifications && certifications.length > 0 && (
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 border-b border-slate-300 mb-2">
                  Certifications
                </h2>
                <ul className="list-disc list-outside pl-4 space-y-1 text-xs text-slate-700">
                  {certifications.map((cert, idx) => {
                    const details = [cert.issuer, cert.date].filter(Boolean).join(' | ');
                    return (
                      <li key={idx}>
                        <span className="font-semibold text-slate-900">{cert.name}</span>
                        {details && (
                          <span className="text-slate-600"> — {details}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* Section: Additional Sections */}
            {additionalSections && additionalSections.length > 0 && (
              <>
                {additionalSections.map((sec, idx) => (
                  <div key={idx}>
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 border-b border-slate-300 mb-2">
                      {sec.title}
                    </h2>
                    <ul className="list-disc list-outside pl-4 space-y-1 text-xs text-slate-700">
                      {sec.items.map((item, itemIdx) => (
                        <li key={itemIdx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
