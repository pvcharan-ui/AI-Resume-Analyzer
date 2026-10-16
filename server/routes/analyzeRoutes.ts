import { Router } from 'express';
import { analyzeApplicationHandler } from '../controllers/analyzeController';

const router = Router();

// POST /api/analyze
router.post('/analyze', analyzeApplicationHandler);

export default router;
