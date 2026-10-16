import { RotateCcw, Zap } from 'lucide-react';

interface NavbarProps {
  onReset: () => void;
  hasActiveAnalysis: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onReset,
  hasActiveAnalysis,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <Zap className="w-5 h-5 fill-white/20" />
          </div>
          <div>
            <span className="text-base font-extrabold tracking-tight text-white">
              CareerPulse<span className="text-cyan-400">.ai</span>
            </span>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              AI-Powered Resume Analysis & Job Application Assistant
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {hasActiveAnalysis && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>New Analysis</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
