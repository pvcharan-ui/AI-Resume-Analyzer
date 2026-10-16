import { useState } from 'react';
import {
  Copy,
  Check,
  FileDown,
  FileText,
  Building2,
  Calendar,
  Sparkles,
  Edit3,
  Loader2,
} from 'lucide-react';
import type { CoverLetterData, CoverLetterTone } from '../../types';
import { TONE_OPTIONS } from '../../services/tones';
import {
  downloadCoverLetterAsPdf,
  downloadCoverLetterAsDocx,
} from '../../services/documentExporter';

interface CoverLetterViewProps {
  coverLetter: CoverLetterData;
  onToneChange?: (tone: CoverLetterTone) => void;
  onToast: (title: string, message?: string, type?: 'success' | 'info') => void;
}

export const CoverLetterView: React.FC<CoverLetterViewProps> = ({
  coverLetter,
  onToneChange,
  onToast,
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isExportingDocx, setIsExportingDocx] = useState(false);

  // Derive generated text directly from props
  const defaultText = [
    coverLetter.dateStr,
    '',
    coverLetter.salutation,
    '',
    coverLetter.openingParagraph,
    '',
    ...coverLetter.bodyParagraphs.map((p) => `${p}\n`),
    coverLetter.closingParagraph,
    '',
    coverLetter.signOff,
    coverLetter.candidateName,
  ].join('\n');

  const [letterContent, setLetterContent] = useState(defaultText);

  const handleCopy = () => {
    navigator.clipboard.writeText(letterContent);
    setCopied(true);
    onToast('Cover Letter Copied', 'Ready to paste into your application', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPdf = () => {
    try {
      downloadCoverLetterAsPdf(coverLetter);
      onToast('PDF Downloaded', 'Cover letter saved as vector PDF', 'success');
    } catch (err) {
      console.error('Failed to export cover letter PDF:', err);
      onToast('Export Failed', 'Could not generate PDF', 'info');
    }
  };

  const handleDownloadDocx = async () => {
    setIsExportingDocx(true);
    try {
      await downloadCoverLetterAsDocx(coverLetter);
      onToast('DOCX Downloaded', 'Editable Word document ready', 'success');
    } catch (err) {
      console.error('Failed to export cover letter DOCX:', err);
      onToast('Export Failed', 'Could not generate DOCX', 'info');
    } finally {
      setIsExportingDocx(false);
    }
  };

  const handleToneSelect = (tone: CoverLetterTone) => {
    if (onToneChange) {
      onToneChange(tone);
    }
  };

  const currentToneOption = TONE_OPTIONS.find((t) => t.id === coverLetter.tone);

  return (
    <div className="space-y-6">
      {/* Top Banner & Action Controls */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Tailored Cover Letter
            </span>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              Tone: {currentToneOption?.label || coverLetter.tone}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            Cover Letter for {coverLetter.companyName}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Personalized cover letter addressed to the company, aligned with the job description.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto shrink-0">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isEditing ? 'Preview Mode' : 'Edit In Place'}</span>
          </button>

          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-cyan-400" />
                <span>Copy Cover Letter</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadPdf}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-all shadow-md shadow-cyan-600/20"
            title="Download cover letter as PDF"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>

          <button
            onClick={handleDownloadDocx}
            disabled={isExportingDocx}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/20"
            title="Download cover letter as Word DOCX"
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

      {/* Tone Switcher Pills */}
      {onToneChange && (
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Cover Letter Tone:
          </span>
          {TONE_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleToneSelect(opt.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                coverLetter.tone === opt.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {/* Letter Paper Mockup */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl relative">
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-800/80 text-xs text-slate-400">
          <div className="flex items-center gap-2 font-mono">
            <Building2 className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-200 font-semibold">{coverLetter.companyName}</span>
          </div>
          <div className="flex items-center gap-2 font-mono">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>{coverLetter.dateStr}</span>
          </div>
        </div>

        {isEditing ? (
          <textarea
            rows={18}
            value={letterContent}
            onChange={(e) => setLetterContent(e.target.value)}
            className="w-full p-4 rounded-xl bg-slate-950 border border-slate-700 text-sm font-sans text-slate-100 focus:border-cyan-400 focus:outline-none leading-relaxed resize-y"
          />
        ) : (
          <div className="space-y-4 text-sm sm:text-base text-slate-200 leading-relaxed font-sans max-w-3xl">
            <p className="font-semibold text-slate-100">{coverLetter.salutation}</p>
            <p>{coverLetter.openingParagraph}</p>
            {coverLetter.bodyParagraphs.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
            <p>{coverLetter.closingParagraph}</p>
            <div className="pt-4">
              <p className="text-slate-300">{coverLetter.signOff}</p>
              <p className="font-bold text-white mt-1 text-base">{coverLetter.candidateName}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
