import { useState } from 'react';
import {
  Copy,
  Check,
  Download,
  FileText,
  Layers,
  ListChecks,
} from 'lucide-react';
import type { UpdatedResumeContent } from '../../types';

interface UpdatedResumeViewProps {
  updatedResume: UpdatedResumeContent;
  onToast: (title: string, message?: string, type?: 'success' | 'info') => void;
}

export const UpdatedResumeView: React.FC<UpdatedResumeViewProps> = ({
  updatedResume,
  onToast,
}) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const {
    optimizedSummary,
    isDraftFromScratch,
    improvedBulletPoints,
    relevantSkills,
    formattingTips,
  } = updatedResume;

  const copyToClipboard = (text: string, sectionId: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    onToast(`Copied ${label}`, 'Content ready to paste', 'success');
    setTimeout(() => {
      setCopiedSection(null);
    }, 2000);
  };

  const handleDownloadFullResume = () => {
    const fullContent = [
      '========================================',
      'OPTIMIZED RESUME SUMMARY',
      '========================================',
      optimizedSummary,
      '',
      '========================================',
      'IMPROVED RESUME BULLET POINTS',
      '========================================',
      ...improvedBulletPoints.map((b) => `• ${b.improved}`),
      '',
      '========================================',
      'RELEVANT SKILLS',
      '========================================',
      `Core Technical: ${relevantSkills.coreTechnical.join(', ')}`,
      `Tools & Frameworks: ${relevantSkills.toolsAndFrameworks.join(', ')}`,
      `Methodologies: ${relevantSkills.methodologiesAndProcesses.join(', ')}`,
      `Soft Competencies: ${relevantSkills.softCompetencies.join(', ')}`,
      '',
      '========================================',
      'ATS FORMATTING RECOMMENDATIONS',
      '========================================',
      ...formattingTips.map((tip) => `- ${tip}`),
    ].join('\n');

    const blob = new Blob([fullContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Updated_Resume_Content.txt`;
    link.click();
    URL.revokeObjectURL(url);
    onToast('Downloaded Resume Content', 'Saved as text file', 'success');
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Resume Optimization
            </span>
            {isDraftFromScratch && (
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                Draft (Created from user information)
              </span>
            )}
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            Updated Resume Content
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Concise, achievement-focused, and ATS-friendly content based on genuine candidate information.
          </p>
        </div>

        <button
          onClick={handleDownloadFullResume}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 hover:border-slate-600 transition-colors shrink-0 shadow-md"
        >
          <Download className="w-4 h-4 text-cyan-400" />
          <span>Export as .TXT</span>
        </button>
      </div>

      {/* 1. Optimized Resume Summary */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Optimized Resume Summary</h4>
              <p className="text-xs text-slate-400">Targeted overview aligned with role requirements</p>
            </div>
          </div>

          <button
            onClick={() => copyToClipboard(optimizedSummary, 'summary', 'Resume Summary')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors border border-slate-700"
          >
            {copiedSection === 'summary' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy Summary</span>
              </>
            )}
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-sm text-slate-200 leading-relaxed">
          {optimizedSummary}
        </div>
      </div>

      {/* 2. Improved Resume Bullet Points */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <ListChecks className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">
                Improved Resume Bullet Points
              </h4>
              <p className="text-xs text-slate-400">
                Concise, achievement-focused, and ATS-friendly phrasing
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {improvedBulletPoints.map((bullet, idx) => (
            <div
              key={bullet.id}
              className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all space-y-3"
            >
              {bullet.original && (
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Original Bullet Point:
                  </span>
                  <p className="text-xs text-slate-400 line-through mt-0.5 leading-relaxed">
                    {bullet.original}
                  </p>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    Improved Bullet Point:
                  </span>

                  <button
                    onClick={() => copyToClipboard(bullet.improved, bullet.id, `Bullet #${idx + 1}`)}
                    className="text-slate-400 hover:text-white p-1 transition-colors"
                    title="Copy this bullet point"
                  >
                    {copiedSection === bullet.id ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs sm:text-sm font-medium text-slate-100 leading-relaxed">
                  {bullet.improved}
                </p>
              </div>

              {bullet.impactReason && (
                <div className="pt-2 border-t border-slate-800/60 text-[11px] text-slate-400">
                  <span>{bullet.impactReason}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 3. Relevant Skills */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Relevant Skills</h4>
              <p className="text-xs text-slate-400">Categorized skills relevant to the target position</p>
            </div>
          </div>

          <button
            onClick={() => {
              const skillsStr = [
                `Technical Skills: ${relevantSkills.coreTechnical.join(', ')}`,
                `Tools & Frameworks: ${relevantSkills.toolsAndFrameworks.join(', ')}`,
                `Methodologies: ${relevantSkills.methodologiesAndProcesses.join(', ')}`,
                `Soft Skills: ${relevantSkills.softCompetencies.join(', ')}`,
              ].join('\n');
              copyToClipboard(skillsStr, 'skills', 'Skills Section');
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors border border-slate-700"
          >
            {copiedSection === 'skills' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy Skills</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-xs font-bold text-slate-300 block mb-2">Technical Skills</span>
            <div className="flex flex-wrap gap-1.5">
              {relevantSkills.coreTechnical.map((skill, i) => (
                <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 font-mono">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-xs font-bold text-slate-300 block mb-2">Tools & Frameworks</span>
            <div className="flex flex-wrap gap-1.5">
              {relevantSkills.toolsAndFrameworks.map((skill, i) => (
                <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 font-mono">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-xs font-bold text-slate-300 block mb-2">Methodologies</span>
            <div className="flex flex-wrap gap-1.5">
              {relevantSkills.methodologiesAndProcesses.map((skill, i) => (
                <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-xs font-bold text-slate-300 block mb-2">Soft Competencies</span>
            <div className="flex flex-wrap gap-1.5">
              {relevantSkills.softCompetencies.map((skill, i) => (
                <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
