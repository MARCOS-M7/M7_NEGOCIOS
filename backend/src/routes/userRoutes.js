
import express from 'express';
import * as userController from '../controllers/userController.js';
import authMiddleware from '../middlewares/auth.js';

const router = express.Router();

// Todas as rotas precisam de autenticação
router.use(authMiddleware);

// Rotas do perfil do usuário
router.get('/me', userController.getProfile);
router.put('/me', userController.updateProfile);
router.get('/notifications', userController.getNotifications);
router.put('/notifications/:id/read', userController.markNotificationAsRead);

// Rotas administrativas
router.get('/', userController.listUsers);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);

export default router;
