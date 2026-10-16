import { useState, useRef } from 'react';
import {
  Upload,
  FileCheck2,
  Trash2,
  AlertCircle,
  Info,
  Loader2,
} from 'lucide-react';
import { extractResumeText } from '../../services/documentExtractor';

interface ResumeUploaderProps {
  resumeText: string;
  setResumeText: (text: string) => void;
  resumeFileName?: string;
  setResumeFileName: (name: string) => void;
}

export const ResumeUploader: React.FC<ResumeUploaderProps> = ({
  resumeText,
  setResumeText,
  resumeFileName,
  setResumeFileName,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('paste');
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const wordCount = resumeText.trim() ? resumeText.trim().split(/\s+/).length : 0;

  const handleFile = async (file: File) => {
    setUploadError(null);
    if (!file) return;

    setIsExtracting(true);

    try {
      const result = await extractResumeText(file);
      setResumeFileName(result.fileName);
      setResumeText(result.text);
    } catch (err: unknown) {
      console.error('Resume extraction error:', err);
      const msg =
        err instanceof Error
          ? err.message
          : 'Failed to extract text from the file. Please paste your resume text directly.';
      setUploadError(msg);
      setResumeFileName('');
      setResumeText('');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleClear = () => {
    setResumeText('');
    setResumeFileName('');
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* Informational Callout regarding optional resume */}
      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <span className="font-semibold text-white">Current Resume is optional:</span> If you do not provide a current resume, the system will create a resume content draft based only on the information provided.
        </p>
      </div>

      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Resume Content <span className="text-slate-400 font-normal lowercase">(optional)</span>
          </label>
        </div>

        {/* Tab switch */}
        <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('paste')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'paste'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Paste Text
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'upload'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Upload File
          </button>
        </div>
      </div>

      {/* Extraction in progress */}
      {isExtracting && (
        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-200">
          <Loader2 className="w-4 h-4 text-indigo-400 animate-spin shrink-0" />
          <div className="text-xs">
            <p className="font-semibold text-white">Extracting resume content...</p>
            <p className="text-[11px] text-indigo-300">Reading text and structure from your uploaded document</p>
          </div>
        </div>
      )}

      {/* File status banner if file is attached */}
      {resumeFileName && !isExtracting && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30">
          <div className="flex items-center gap-2.5 min-w-0">
            <FileCheck2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-200 truncate">{resumeFileName}</p>
              <p className="text-[11px] text-cyan-300">{wordCount} words extracted & ready</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('paste')}
              className="text-xs text-cyan-400 hover:text-cyan-300 underline font-medium"
            >
              Review / Edit Text
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
              title="Remove attached resume"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Upload Zone Tab */}
      {activeTab === 'upload' && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
            dragActive
              ? 'border-cyan-400 bg-cyan-950/20 shadow-inner'
              : 'border-slate-700/80 bg-slate-900/40 hover:border-slate-600 hover:bg-slate-900/70'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.pdf,.docx,.doc,.md"
            onChange={(e) => e.target.files && handleFile(e.target.files[0])}
            className="hidden"
          />
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-3">
            <Upload className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold text-slate-200">
            Click to upload or drag & drop your resume file
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Supports PDF, DOCX, TXT, or Markdown
          </p>
        </div>
      )}

      {/* Paste / Editor Tab */}
      {activeTab === 'paste' && (
        <div className="relative">
          <textarea
            rows={7}
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your current resume content here (summary, work history, skills, education)..."
            className="w-full p-3.5 rounded-xl bg-slate-900 border border-slate-700/80 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-xs font-mono text-slate-200 placeholder:text-slate-500 placeholder:font-sans transition-colors resize-y leading-relaxed"
          />
          <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400 px-1">
            <span>
              {wordCount > 0 ? (
                <span className="text-cyan-400 font-semibold">{wordCount} words</span>
              ) : (
                'Optional – Leave empty to generate a draft from provided inputs'
              )}
            </span>
            {resumeText.trim() && (
              <button
                type="button"
                onClick={handleClear}
                className="text-slate-400 hover:text-rose-400 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}

      {uploadError && (
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}
    </div>
  );
};
