
import express from 'express';
import * as financialController from '../controllers/financialController.js';
import authMiddleware from '../middlewares/auth.js';

const router = express.Router();

// Todas as rotas precisam de autenticação
router.use(authMiddleware);

// Sumário financeiro
router.get('/summary', financialController.getFinancialSummary);

// Rotas de recebíveis
router.get('/receivables', financialController.listReceivables);
router.post('/receivables', financialController.createReceivable);
router.put('/receivables/:id/status', financialController.updateReceivableStatus);

// Rotas de pagamentos
router.get('/payables', financialController.listPayables);
router.post('/payables', financialController.createPayable);
router.put('/payables/:id/status', financialController.updatePayableStatus);

// Relatórios
router.get('/report', financialController.generateFinancialReport);

export default router;
