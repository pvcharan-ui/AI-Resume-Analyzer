import { useState } from 'react';
import {
  Award,
  CheckCircle2,
  FileText,
  MessageSquare,
  ArrowLeft,
  Building2,
  GraduationCap,
  Briefcase,
} from 'lucide-react';
import type {
  AnalysisResult,
  ApplicationInput,
  CoverLetterTone,
} from '../../types';
import { AtsScoreMeter } from './AtsScoreMeter';
import { KeywordMatchView } from './KeywordMatchView';
import { TailoredResumeView } from './TailoredResumeView';
import { CoverLetterView } from './CoverLetterView';
import { Badge } from '../common/Badge';

interface AnalysisDashboardProps {
  result: AnalysisResult;
  input: ApplicationInput;
  onEditApplication: () => void;
  onToast: (title: string, message?: string, type?: 'success' | 'info') => void;
  onUpdateCoverLetterTone?: (tone: CoverLetterTone) => void;
}

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({
  result,
  input,
  onEditApplication,
  onToast,
  onUpdateCoverLetterTone,
}) => {
  const [activeTab, setActiveTab] = useState<'ats' | 'keywords' | 'resume' | 'coverletter'>('ats');

  const handleToneChange = (newTone: CoverLetterTone) => {
    if (onUpdateCoverLetterTone) {
      onUpdateCoverLetterTone(newTone);
    }
    onToast('Tone Selected', `Preferred tone set to ${newTone}`, 'info');
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Top Application Header Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <button
              onClick={onEditApplication}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 font-semibold mr-2 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Edit Inputs</span>
            </button>
            <Badge variant="cyan" size="sm" icon={<Building2 className="w-3 h-3" />}>
              {input.companyName}
            </Badge>
            <Badge
              variant={input.experienceLevel === 'fresher' ? 'primary' : 'indigo'}
              size="sm"
              icon={
                input.experienceLevel === 'fresher' ? (
                  <GraduationCap className="w-3 h-3" />
                ) : (
                  <Briefcase className="w-3 h-3" />
                )
              }
            >
              {input.experienceLevel === 'fresher' ? 'Fresher' : 'Experienced'}
            </Badge>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Application Analysis Results
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Generated on{' '}
            {new Date(result.timestamp).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>

        {/* ATS Score Indicator */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-950/70 border border-slate-800 px-4 py-2.5 rounded-2xl flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                ATS Score
              </span>
              <span className="text-xs font-semibold text-slate-200">
                {result.atsScore.ratingTier}
              </span>
            </div>
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg ${
                result.atsScore.overallScore >= 80
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : result.atsScore.overallScore >= 70
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                  : result.atsScore.overallScore >= 50
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
              }`}
            >
              {result.atsScore.overallScore}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-slate-900/60 border border-slate-800/80 p-1.5 rounded-2xl flex flex-wrap gap-1.5">
        <button
          onClick={() => setActiveTab('ats')}
          className={`flex-1 min-w-[140px] px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'ats'
              ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-lg shadow-indigo-600/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>ATS Score Estimate</span>
          <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-md bg-white/20 text-white font-mono">
            {result.atsScore.overallScore}%
          </span>
        </button>

        <button
          onClick={() => setActiveTab('keywords')}
          className={`flex-1 min-w-[140px] px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'keywords'
              ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-lg shadow-indigo-600/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Keyword Match Analysis</span>
          <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-md bg-white/20 text-white font-mono">
            {result.keywordAnalysis.matchedCount} / {result.keywordAnalysis.totalJdKeywords}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('resume')}
          className={`flex-1 min-w-[140px] px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'resume'
              ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-lg shadow-indigo-600/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Tailored Resume</span>
        </button>

        <button
          onClick={() => setActiveTab('coverletter')}
          className={`flex-1 min-w-[140px] px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'coverletter'
              ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-lg shadow-indigo-600/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Tailored Cover Letter</span>
          <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-md bg-white/20 text-white capitalize">
            {result.coverLetter.tone}
          </span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="pt-2">
        {activeTab === 'ats' && <AtsScoreMeter scoreAnalysis={result.atsScore} />}
        {activeTab === 'keywords' && (
          <KeywordMatchView keywordAnalysis={result.keywordAnalysis} />
        )}
        {activeTab === 'resume' && (
          <TailoredResumeView
            tailoredResume={
              result.tailoredResume || {
                isDraftFromScratch: result.updatedResume?.isDraftFromScratch ?? false,
                header: { fullName: result.coverLetter.candidateName || 'Candidate' },
                professionalSummary: result.updatedResume?.optimizedSummary || '',
                skills: [
                  {
                    category: 'Core Skills',
                    skills: result.updatedResume?.relevantSkills.coreTechnical || [],
                  },
                ],
                experience: [],
                projects: [],
                education: [],
                certifications: [],
                additionalSections: [],
              }
            }
            onToast={onToast}
          />
        )}
        {activeTab === 'coverletter' && (
          <CoverLetterView
            coverLetter={result.coverLetter}
            onToneChange={handleToneChange}
            onToast={onToast}
          />
        )}
      </div>
    </div>
  );
};
