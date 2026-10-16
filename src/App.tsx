import { useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ApplicationForm } from './components/input/ApplicationForm';
import { AnalysisDashboard } from './components/analysis/AnalysisDashboard';
import { LoadingState } from './components/common/LoadingState';
import { EmptyState } from './components/common/EmptyState';
import { ToastContainer, type ToastMessage } from './components/common/Toast';
import type { ApplicationInput, AnalysisResult, AnalysisStatus, CoverLetterTone } from './types';
import { analyzeApplication } from './services/api';

const DEFAULT_INPUT: ApplicationInput = {
  companyName: '',
  experienceLevel: 'experienced',
  jobDescription: '',
  resumeText: '',
  resumeFileName: '',
  coverLetterTone: 'professional',
};

export function App() {
  const [input, setInput] = useState<ApplicationInput>(DEFAULT_INPUT);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [status, setStatus] = useState<AnalysisStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (title: string, message?: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, title, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAnalyze = async () => {
    setStatus('analyzing');
    setErrorMessage(null);

    try {
      const analysisResult = await analyzeApplication(input);
      setResult(analysisResult);
      setStatus('completed');
      addToast(
        'Analysis Complete',
        `Analysis assets generated for ${input.companyName}`,
        'success'
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: unknown) {
      console.error('Analysis error:', err);
      setStatus('error');
      const msg = err instanceof Error ? err.message : 'An error occurred during analysis. Please try again.';
      setErrorMessage(msg);
      addToast('Analysis Failed', msg, 'error');
    }
  };

  const handleReset = () => {
    setInput(DEFAULT_INPUT);
    setResult(null);
    setStatus('idle');
    setErrorMessage(null);
    addToast('Reset', 'Form cleared for new application', 'info');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollToForm = () => {
    const formElement = document.getElementById('application-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleUpdateCoverLetterTone = (newTone: CoverLetterTone) => {
    setInput((prev) => ({ ...prev, coverLetterTone: newTone }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100 selection:bg-cyan-500 selection:text-white">
      {/* Navigation Header */}
      <Navbar
        onReset={handleReset}
        hasActiveAnalysis={status === 'completed'}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Analyzing / Loading State */}
        {status === 'analyzing' && <LoadingState />}

        {/* Error State */}
        {status === 'error' && errorMessage && (
          <div className="max-w-2xl mx-auto my-12 p-6 rounded-3xl bg-rose-950/40 border border-rose-500/40 text-center space-y-4">
            <h3 className="text-lg font-bold text-rose-300">Analysis Service Notice</h3>
            <p className="text-sm text-slate-300">{errorMessage}</p>
            <button
              onClick={() => setStatus('idle')}
              className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors"
            >
              Return to Form
            </button>
          </div>
        )}

        {/* Completed Results State */}
        {status === 'completed' && result && (
          <AnalysisDashboard
            result={result}
            input={input}
            onEditApplication={() => {
              setStatus('idle');
              setTimeout(handleScrollToForm, 100);
            }}
            onToast={addToast}
            onUpdateCoverLetterTone={handleUpdateCoverLetterTone}
          />
        )}

        {/* Idle Form & Landing State */}
        {status === 'idle' && (
          <div className="space-y-12">
            {/* Show EmptyState intro banner when form is blank */}
            {!input.jobDescription && <EmptyState />}

            {/* Application Input Form */}
            <ApplicationForm
              input={input}
              setInput={setInput}
              onAnalyze={handleAnalyze}
              isLoading={false}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}

export default App;
