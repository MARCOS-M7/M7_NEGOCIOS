
import express from 'express';
import * as authController from '../controllers/authController.js';

const router = express.Router();

// Rotas públicas
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/reset-password', authController.resetPassword);

export default router;
