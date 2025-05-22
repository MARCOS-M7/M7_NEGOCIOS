
import express from 'express';
import * as partnerController from '../controllers/partnerController.js';
import authMiddleware from '../middlewares/auth.js';

const router = express.Router();

// Todas as rotas precisam de autenticação
router.use(authMiddleware);

router.get('/', partnerController.listPartners);
router.get('/fetch-info', partnerController.fetchPartnerInfo);
router.get('/:id', partnerController.getPartner);
router.post('/', partnerController.createPartner);
router.put('/:id', partnerController.updatePartner);

export default router;
