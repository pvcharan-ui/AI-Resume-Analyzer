import { Zap, CheckCircle2, FileCheck } from 'lucide-react';

const CURRENT_YEAR = new Date().getFullYear();

export const Footer = () => {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950/60 mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold text-white">CareerPulse AI</span>
              <p className="text-xs text-slate-400">
                Resume Analysis & Job Application Assistant
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> ATS Compatibility Ready
            </span>
            <span className="flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-cyan-400" /> Modular React Architecture
            </span>
          </div>

          <p className="text-xs text-slate-400">
            © {CURRENT_YEAR} CareerPulse AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
