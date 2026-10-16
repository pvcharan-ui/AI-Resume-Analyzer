import { useEffect, useState } from 'react';
import { Cpu, CheckCircle2, Loader2, Sparkles } from 'lucide-react';

const PIPELINE_STAGES = [
  {
    step: 1,
    title: 'Parsing Application Materials',
    detail: 'Tokenizing job description requirements and processing resume content...',
  },
  {
    step: 2,
    title: 'Analyzing Keywords & Skill Requirements',
    detail: 'Extracting essential keywords and comparing against provided qualifications...',
  },
  {
    step: 3,
    title: 'Estimating ATS Score & Formatting Health',
    detail: 'Evaluating keyword relevance, alignment, and readability factors...',
  },
  {
    step: 4,
    title: 'Generating Updated Resume Content',
    detail: 'Formulating optimized summary, bullet points, and skills taxonomy...',
  },
  {
    step: 5,
    title: 'Generating Tailored Cover Letter',
    detail: 'Composing personalized letter for the target company in the selected tone...',
  },
];

export const LoadingState: React.FC = () => {
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStage((prev) => {
        if (prev < PIPELINE_STAGES.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 600);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto py-12 px-6">
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              Analyzing Application Materials
              <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '4s' }} />
            </h3>
            <p className="text-xs text-slate-400">
              Evaluating resume content against the job description
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800/80 rounded-full h-2 mb-8 overflow-hidden">
          <div
            className="bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((currentStage + 1) / PIPELINE_STAGES.length) * 100}%` }}
          />
        </div>

        {/* Pipeline Steps */}
        <div className="space-y-4">
          {PIPELINE_STAGES.map((stage, idx) => {
            const isDone = idx < currentStage;
            const isCurrent = idx === currentStage;

            return (
              <div
                key={stage.step}
                className={`flex items-start gap-3.5 p-3 rounded-xl transition-all duration-300 ${
                  isCurrent
                    ? 'bg-slate-800/70 border border-indigo-500/30 shadow-md'
                    : isDone
                    ? 'bg-slate-900/40 text-slate-400'
                    : 'opacity-40 text-slate-500'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : isCurrent ? (
                    <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center text-[10px] text-slate-500">
                      {stage.step}
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p
                      className={`text-sm font-medium ${
                        isCurrent
                          ? 'text-cyan-300'
                          : isDone
                          ? 'text-slate-200'
                          : 'text-slate-500'
                      }`}
                    >
                      {stage.title}
                    </p>
                    {isCurrent && (
                      <span className="text-[11px] font-semibold text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded-full animate-pulse">
                        In Progress
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                    {stage.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span>Processing application data</span>
          <span className="text-slate-500 font-mono">
            Step {currentStage + 1} of {PIPELINE_STAGES.length}
          </span>
        </div>
      </div>
    </div>
  );
};
