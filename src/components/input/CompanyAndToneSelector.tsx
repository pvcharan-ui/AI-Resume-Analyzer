import {
  Briefcase,
  TrendingUp,
  MessageSquare,
  Flame,
  Award,
  GraduationCap,
  Building2,
  Check,
} from 'lucide-react';
import type { CoverLetterTone, ExperienceLevel } from '../../types';
import { TONE_OPTIONS } from '../../services/tones';

interface CompanyAndToneSelectorProps {
  companyName: string;
  setCompanyName: (val: string) => void;
  experienceLevel: ExperienceLevel;
  setExperienceLevel: (val: ExperienceLevel) => void;
  coverLetterTone: CoverLetterTone;
  setCoverLetterTone: (val: CoverLetterTone) => void;
}

export const CompanyAndToneSelector: React.FC<CompanyAndToneSelectorProps> = ({
  companyName,
  setCompanyName,
  experienceLevel,
  setExperienceLevel,
  coverLetterTone,
  setCoverLetterTone,
}) => {
  const getToneIcon = (iconName: string) => {
    switch (iconName) {
      case 'TrendingUp':
        return <TrendingUp className="w-4 h-4 text-cyan-400" />;
      case 'MessageSquare':
        return <MessageSquare className="w-4 h-4 text-emerald-400" />;
      case 'Flame':
        return <Flame className="w-4 h-4 text-amber-400" />;
      case 'Award':
        return <Award className="w-4 h-4 text-purple-400" />;
      case 'Briefcase':
      default:
        return <Briefcase className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Company Name Input */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
          Company Name <span className="text-cyan-400">*</span>
        </label>
        <div className="relative">
          <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Enter company name..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-sm text-slate-100 placeholder:text-slate-500 transition-colors"
            required
          />
        </div>
      </div>

      {/* Experience Level Selector: Fresher / Experienced */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
          Experience Level <span className="text-cyan-400">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setExperienceLevel('fresher')}
            className={`p-4 rounded-xl border text-left transition-all duration-200 flex items-start gap-3.5 ${
              experienceLevel === 'fresher'
                ? 'bg-cyan-950/40 border-cyan-500/80 shadow-lg shadow-cyan-950/50 ring-1 ring-cyan-500/50'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400'
            }`}
          >
            <div
              className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                experienceLevel === 'fresher'
                  ? 'bg-cyan-500/20 text-cyan-300'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-bold ${experienceLevel === 'fresher' ? 'text-white' : 'text-slate-300'}`}>
                  Fresher
                </span>
                {experienceLevel === 'fresher' && (
                  <span className="w-4 h-4 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Entry level, student, or recent graduate. Evaluates academic coursework, foundational skills, and projects.
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setExperienceLevel('experienced')}
            className={`p-4 rounded-xl border text-left transition-all duration-200 flex items-start gap-3.5 ${
              experienceLevel === 'experienced'
                ? 'bg-indigo-950/40 border-indigo-500/80 shadow-lg shadow-indigo-950/50 ring-1 ring-indigo-500/50'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400'
            }`}
          >
            <div
              className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                experienceLevel === 'experienced'
                  ? 'bg-indigo-500/20 text-indigo-300'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              <Briefcase className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-bold ${experienceLevel === 'experienced' ? 'text-white' : 'text-slate-300'}`}>
                  Experienced
                </span>
                {experienceLevel === 'experienced' && (
                  <span className="w-4 h-4 rounded-full bg-indigo-500 text-white flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Professional industry experience. Evaluates work history, accomplishments, and skills alignment.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Preferred Cover Letter Tone Selector */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
          Preferred Cover Letter Tone <span className="text-cyan-400">*</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {TONE_OPTIONS.map((opt) => {
            const isSelected = coverLetterTone === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => setCoverLetterTone(opt.id)}
                className={`cursor-pointer p-3 rounded-xl border text-left transition-all duration-200 ${
                  isSelected
                    ? 'bg-slate-800/90 border-cyan-400/80 shadow-md ring-1 ring-cyan-400/40'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-md bg-slate-800 border border-slate-700">
                      {getToneIcon(opt.iconName)}
                    </span>
                    <span
                      className={`text-xs font-bold ${
                        isSelected ? 'text-cyan-300' : 'text-slate-200'
                      }`}
                    >
                      {opt.label}
                    </span>
                  </div>
                  {isSelected && (
                    <span className="w-3.5 h-3.5 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                  {opt.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
