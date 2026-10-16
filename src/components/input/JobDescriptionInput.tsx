import { FileSearch } from 'lucide-react';

interface JobDescriptionInputProps {
  jobDescription: string;
  setJobDescription: (val: string) => void;
}

export const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({
  jobDescription,
  setJobDescription,
}) => {
  const wordCount = jobDescription.trim() ? jobDescription.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <span>Job Description</span>
          <span className="text-cyan-400">*</span>
        </label>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <FileSearch className="w-3.5 h-3.5 text-cyan-400" />
          <span>
            {wordCount > 0 ? (
              <span className="text-cyan-400 font-semibold">{wordCount} words</span>
            ) : (
              'Required'
            )}
          </span>
        </div>
      </div>

      <div className="relative">
        <textarea
          rows={8}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the target job description here..."
          className="w-full p-3.5 rounded-xl bg-slate-900 border border-slate-700/80 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-xs font-mono text-slate-200 placeholder:text-slate-500 placeholder:font-sans transition-colors resize-y leading-relaxed"
          required
        />
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
        <span>Provide the full job description for accurate keyword matching and ATS scoring.</span>
        {jobDescription.trim() && (
          <button
            type="button"
            onClick={() => setJobDescription('')}
            className="text-slate-400 hover:text-rose-400 transition-colors"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
};
