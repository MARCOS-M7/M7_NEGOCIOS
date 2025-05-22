
import express from 'express';
import * as crmController from '../controllers/crmController.js';
import authMiddleware from '../middlewares/auth.js';

const router = express.Router();

// Todas as rotas precisam de autenticação
router.use(authMiddleware);

router.get('/attendances', crmController.listAttendances);
router.get('/attendances/:id', crmController.getAttendance);
router.post('/attendances', crmController.createAttendance);
router.put('/attendances/:id', crmController.updateAttendance);
router.put('/attendances/:id/close', crmController.closeAttendance);

export default router;
