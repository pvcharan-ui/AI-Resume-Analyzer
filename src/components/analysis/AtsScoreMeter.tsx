import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  TrendingUp,
  Award,
} from 'lucide-react';
import type { AtsScoreAnalysis } from '../../types';
import { Badge } from '../common/Badge';

interface AtsScoreMeterProps {
  scoreAnalysis: AtsScoreAnalysis;
}

export const AtsScoreMeter: React.FC<AtsScoreMeterProps> = ({ scoreAnalysis }) => {
  const { overallScore, ratingTier, explanation, breakdown, formattingHealth, detectedIrrelevantContent } =
    scoreAnalysis;

  // Determine colors based on score
  const getScoreColor = (score: number) => {
    if (score >= 85) return { stroke: '#10b981', text: 'text-emerald-400', bg: 'bg-emerald-500/10' };
    if (score >= 70) return { stroke: '#06b6d4', text: 'text-cyan-400', bg: 'bg-cyan-500/10' };
    if (score >= 50) return { stroke: '#f59e0b', text: 'text-amber-400', bg: 'bg-amber-500/10' };
    return { stroke: '#f43f5e', text: 'text-rose-400', bg: 'bg-rose-500/10' };
  };

  const colors = getScoreColor(overallScore);

  // SVG Gauge calculations (radius = 70, circumference = 2 * PI * 70 = 439.82)
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  return (
    <div className="space-y-6">
      {/* Top Banner: Score Gauge & Explanation */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-xl flex flex-col lg:flex-row items-center gap-8">
        {/* Radial SVG Gauge */}
        <div className="relative shrink-0 flex flex-col items-center">
          <svg className="w-44 h-44 -rotate-90 transform" viewBox="0 0 160 160">
            {/* Background circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="currentColor"
              strokeWidth="12"
              className="text-slate-800"
              fill="transparent"
            />
            {/* Progress circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke={colors.stroke}
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Centered Score Number */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className={`text-4xl font-black tracking-tight ${colors.text}`}>
              {overallScore}
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              out of 100
            </span>
          </div>

          <div className="mt-3">
            <Badge
              variant={
                overallScore >= 85
                  ? 'success'
                  : overallScore >= 70
                  ? 'cyan'
                  : overallScore >= 50
                  ? 'warning'
                  : 'danger'
              }
            >
              {ratingTier}
            </Badge>
          </div>
        </div>

        {/* Score Explanation */}
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 text-slate-300 text-xs font-semibold mb-3">
            <Award className="w-3.5 h-3.5 text-cyan-400" />
            <span>ATS Score Breakdown</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
            Estimated ATS Score: <span className={colors.text}>{overallScore}%</span>
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80">
            {explanation}
          </p>
        </div>
      </div>

      {/* Sub-Score Breakdown Matrix */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-xl">
        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-cyan-400" />
          <span>Score Breakdown</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(breakdown).map(([key, item]) => {
            const pct = Math.round((item.score / item.maxScore) * 100);
            return (
              <div key={key} className="bg-slate-950/50 border border-slate-800/80 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-200">{item.name}</span>
                  <span className="text-xs font-mono font-bold text-cyan-400">
                    {item.score} / {item.maxScore} pts
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-slate-800 rounded-full h-1.5 mb-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Formatting & Readability Checks */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-xl">
        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-emerald-400" />
          <span>Formatting & Readability Checks</span>
        </h4>

        <div className="space-y-3">
          {formattingHealth.map((check, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80"
            >
              <div className="mt-0.5 shrink-0">
                {check.status === 'passed' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : check.status === 'warning' ? (
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                ) : (
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-200">{check.item}</p>
                  <span
                    className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                      check.status === 'passed'
                        ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                        : check.status === 'warning'
                        ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                        : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                    }`}
                  >
                    {check.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{check.details}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Irrelevant or Unnecessary Content Alerts */}
      {detectedIrrelevantContent.length > 0 && (
        <div className="bg-slate-900/80 border border-amber-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-xl">
          <div className="flex items-center gap-2.5 mb-3">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h4 className="text-sm font-bold text-amber-300">
              Irrelevant or Unnecessary Content Detected ({detectedIrrelevantContent.length})
            </h4>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            The following vague, irrelevant, or unnecessary content was identified:
          </p>
          <div className="space-y-2">
            {detectedIrrelevantContent.map((item, idx) => (
              <div
                key={idx}
                className="text-xs text-amber-200 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3.5 py-2.5 flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
