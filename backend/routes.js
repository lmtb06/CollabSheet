import { Router } from 'express';
import apiRoutes from './routes/api/routes.js';

const router = Router();

// router.use('/', webRoutes);      // Routes pour les pages web
router.use('/api', apiRoutes);   // Routes pour l'API

export default router;
