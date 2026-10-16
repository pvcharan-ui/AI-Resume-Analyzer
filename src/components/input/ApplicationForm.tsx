import { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react';
import type { ApplicationInput } from '../../types';
import { CompanyAndToneSelector } from './CompanyAndToneSelector';
import { ResumeUploader } from './ResumeUploader';
import { JobDescriptionInput } from './JobDescriptionInput';

interface ApplicationFormProps {
  input: ApplicationInput;
  setInput: React.Dispatch<React.SetStateAction<ApplicationInput>>;
  onAnalyze: () => void;
  isLoading: boolean;
}

export const ApplicationForm: React.FC<ApplicationFormProps> = ({
  input,
  setInput,
  onAnalyze,
  isLoading,
}) => {
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!input.companyName.trim()) {
      setValidationError('Please specify the Company Name.');
      return;
    }

    if (!input.jobDescription.trim()) {
      setValidationError('Please provide the Job Description to perform analysis.');
      return;
    }

    if (input.jobDescription.trim().length < 30) {
      setValidationError('Job Description is too short. Please provide a more complete job posting.');
      return;
    }

    onAnalyze();
  };

  return (
    <form id="application-form" onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto space-y-8">
      {/* Section 1: Target Company & Preferences */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-sm">
            1
          </div>
          <div>
            <h2 className="text-base font-bold text-white">
              Target Company & Preferences
            </h2>
            <p className="text-xs text-slate-400">
              Specify the company name, experience level, and preferred cover letter tone.
            </p>
          </div>
        </div>

        <CompanyAndToneSelector
          companyName={input.companyName}
          setCompanyName={(val) => setInput((prev) => ({ ...prev, companyName: val }))}
          experienceLevel={input.experienceLevel}
          setExperienceLevel={(val) => setInput((prev) => ({ ...prev, experienceLevel: val }))}
          coverLetterTone={input.coverLetterTone}
          setCoverLetterTone={(val) => setInput((prev) => ({ ...prev, coverLetterTone: val }))}
        />
      </div>

      {/* Section 2: Job Description */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-sm">
            2
          </div>
          <div>
            <h2 className="text-base font-bold text-white">
              Job Description
            </h2>
            <p className="text-xs text-slate-400">
              The job posting requirements to evaluate keywords, skills, and ATS alignment against.
            </p>
          </div>
        </div>

        <JobDescriptionInput
          jobDescription={input.jobDescription}
          setJobDescription={(val) => setInput((prev) => ({ ...prev, jobDescription: val }))}
        />
      </div>

      {/* Section 3: Current Resume (Optional) */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm">
            3
          </div>
          <div>
            <h2 className="text-base font-bold text-white">
              Current Resume <span className="text-xs font-normal text-slate-400">(Optional)</span>
            </h2>
            <p className="text-xs text-slate-400">
              Upload your document or paste the text. If omitted, a draft will be created based on your inputs.
            </p>
          </div>
        </div>

        <ResumeUploader
          resumeText={input.resumeText}
          setResumeText={(text) => setInput((prev) => ({ ...prev, resumeText: text }))}
          resumeFileName={input.resumeFileName}
          setResumeFileName={(name) => setInput((prev) => ({ ...prev, resumeFileName: name }))}
        />
      </div>

      {/* Validation error banner */}
      {validationError && (
        <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-500/40 flex items-start gap-3 text-rose-200 text-xs">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          <div className="flex-1">
            <p className="font-bold">Required Information Missing</p>
            <p className="mt-0.5 text-rose-300">{validationError}</p>
          </div>
        </div>
      )}

      {/* Primary CTA */}
      <div className="pt-2 flex flex-col items-center">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto min-w-[300px] px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-indigo-700 hover:from-cyan-400 hover:via-indigo-500 hover:to-indigo-600 active:scale-[0.98] text-white font-bold text-sm shadow-xl shadow-indigo-600/30 hover:shadow-cyan-500/30 transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <Sparkles className="w-4 h-4 text-cyan-200" />
          <span>Analyze & Generate</span>
          <ArrowRight className="w-4 h-4 text-cyan-200 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </form>
  );
};
