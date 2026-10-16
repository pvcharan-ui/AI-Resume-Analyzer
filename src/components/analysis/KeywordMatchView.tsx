import { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Search,
  ShieldAlert,
} from 'lucide-react';
import type { KeywordAnalysis } from '../../types';

interface KeywordMatchViewProps {
  keywordAnalysis: KeywordAnalysis;
}

export const KeywordMatchView: React.FC<KeywordMatchViewProps> = ({ keywordAnalysis }) => {
  const [filterMode, setFilterMode] = useState<'all' | 'matched' | 'missing'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const {
    matchedKeywords,
    missingKeywords,
    matchRatePercentage,
    totalJdKeywords,
    matchedCount,
    missingCount,
  } = keywordAnalysis;

  const allKeywords = [...matchedKeywords, ...missingKeywords];

  // Filter based on search, status, and category
  const filteredKeywords = allKeywords.filter((item) => {
    // Status filter
    if (filterMode === 'matched' && !item.inResume) return false;
    if (filterMode === 'missing' && item.inResume) return false;

    // Category filter
    if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;

    // Search query
    if (searchQuery.trim() && !item.term.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Match Rate Summary Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Keyword Match Analysis
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
              {matchRatePercentage}% Keyword Match
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {matchedCount} matched keywords and {missingCount} missing keywords detected from the job description ({totalJdKeywords} total).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
              <span className="text-xs text-emerald-400 font-medium">Matched</span>
              <p className="text-lg font-extrabold text-emerald-300">{matchedCount}</p>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center">
              <span className="text-xs text-amber-400 font-medium">Missing</span>
              <p className="text-lg font-extrabold text-amber-300">{missingCount}</p>
            </div>
          </div>
        </div>

        {/* Overlap Progress Bar */}
        <div className="w-full bg-slate-800/80 rounded-full h-3 overflow-hidden flex">
          <div
            className="bg-emerald-500 transition-all duration-700"
            style={{ width: `${(matchedCount / (totalJdKeywords || 1)) * 100}%` }}
          />
          <div
            className="bg-amber-500 transition-all duration-700"
            style={{ width: `${(missingCount / (totalJdKeywords || 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Mandatory Recommendation Guideline */}
      <div className="bg-amber-950/30 border border-amber-500/40 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="flex-1 text-xs text-slate-300 leading-relaxed">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-1">
            Recommendation Guideline
          </h4>
          <p>
            Only add a missing keyword to your resume if you genuinely have that skill or experience. Never invent or include skills you do not possess.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-md shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Status Segment Filter */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 w-full md:w-auto">
            <button
              onClick={() => setFilterMode('all')}
              className={`flex-1 md:flex-initial px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterMode === 'all'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({allKeywords.length})
            </button>
            <button
              onClick={() => setFilterMode('matched')}
              className={`flex-1 md:flex-initial px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                filterMode === 'matched'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-emerald-400'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Matched ({matchedCount})</span>
            </button>
            <button
              onClick={() => setFilterMode('missing')}
              className={`flex-1 md:flex-initial px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                filterMode === 'missing'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-amber-400'
              }`}
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Missing ({missingCount})</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search keywords..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/60">
          <span className="text-[11px] text-slate-400 font-medium">Category:</span>
          {['all', 'technical', 'tool', 'methodology', 'soft', 'domain'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium capitalize transition-colors ${
                categoryFilter === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Keywords Grid Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredKeywords.map((item, idx) => (
          <div
            key={idx}
            className={`p-3.5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
              item.inResume
                ? 'bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-500/60'
                : 'bg-amber-950/20 border-amber-500/30 hover:border-amber-500/60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    item.importance === 'critical'
                      ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                      : item.importance === 'important'
                      ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.importance}
                </span>

                <span className="text-[11px] text-slate-400 capitalize">
                  {item.category}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {item.inResume ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-amber-400 shrink-0" />
                )}
                <h5 className="text-sm font-bold text-slate-100">{item.term}</h5>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">
                Mentioned in JD: <span className="text-slate-200 font-semibold">{item.frequencyInJD}x</span>
              </span>
              <span
                className={`font-semibold ${
                  item.inResume ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {item.inResume ? 'Matched in Resume' : 'Missing in Resume'}
              </span>
            </div>
          </div>
        ))}

        {filteredKeywords.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400">
            <p className="text-sm">No keywords match your selected filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};
