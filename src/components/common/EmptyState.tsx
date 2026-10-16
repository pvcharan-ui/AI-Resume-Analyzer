import {
  FileText,
  Target,
  Sparkles,
  CheckCircle,
  FileCheck2,
} from 'lucide-react';

export const EmptyState: React.FC = () => {
  return (
    <div className="w-full max-w-5xl mx-auto py-6">
      {/* Intro Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI-Powered Application Analysis</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-3">
          Resume Analysis & Job Application Assistant
        </h1>
        <p className="text-sm md:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Evaluate your resume against target job requirements, inspect keyword alignment, calculate ATS score estimates, and generate a tailored cover letter and updated resume content.
        </p>
      </div>

      {/* The 4 Core Capabilities */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Tailored Cover Letter */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-3.5">
            <FileText className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-bold text-slate-100 mb-1">Tailored Cover Letter</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Professional cover letter personalized for the target company in your preferred tone.
          </p>
        </div>

        {/* 2. Updated Resume Content */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3.5">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-bold text-slate-100 mb-1">Updated Resume Content</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Optimized summary, improved achievement bullet points, relevant skills, and ATS-friendly phrasing.
          </p>
        </div>

        {/* 3. Keyword Match Analysis */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3.5">
            <CheckCircle className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-bold text-slate-100 mb-1">Keyword Match Analysis</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Detailed breakdown of matched and missing keywords from the job description with clear recommendations.
          </p>
        </div>

        {/* 4. ATS Score Estimate */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-3.5">
            <Target className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-bold text-slate-100 mb-1">ATS Score Estimate</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            0–100 ATS score estimate comparing the resume against job requirements with detailed explanations.
          </p>
        </div>
      </div>
    </div>
  );
};
