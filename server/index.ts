import 'dotenv/config';
import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import analyzeRoutes from './routes/analyzeRoutes';

import { GEMINI_MODEL } from './config/gemini';

const app = express();
const PORT = process.env.PORT || 5000;

// Security and utility middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    service: 'ai-resume-analyzer-backend',
    hasApiKey: !!process.env.GEMINI_API_KEY?.trim(),
    model: GEMINI_MODEL,
  });
});

// API routes
app.use('/api', analyzeRoutes);

// 404 handler for undefined API routes
app.use('/api', (_req: Request, res: Response) => {
  res.status(404).json({ error: 'Endpoint not found.' });
});

// Global error handler
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof SyntaxError && 'status' in err && (err as { status: number }).status === 400) {
    res.status(400).json({ error: 'Invalid JSON payload format.' });
    return;
  }
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'An internal server error occurred.' });
});

// Start listening
app.listen(PORT, () => {
  console.log(`[Backend] Server listening on http://localhost:${PORT}`);
  console.log(`[Backend] Gemini API Key present: ${!!process.env.GEMINI_API_KEY?.trim()}`);
});

export default app;
