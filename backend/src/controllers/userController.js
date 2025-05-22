
import { User, Partner, Notification } from '../models/index.js';
import bcrypt from 'bcryptjs';

export const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [{ model: Partner, attributes: ['id', 'name', 'type'] }],
      attributes: { exclude: ['password_hash'] }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    // Se estiver alterando a senha, verificar a senha atual
    if (newPassword) {
      const isValid = await bcrypt.compare(currentPassword, user.password_hash);
      if (!isValid) {
        return res.status(401).json({ error: 'Senha atual incorreta' });
      }
      
      // Atualizar senha
      const hash = await bcrypt.hash(newPassword, 10);
      await user.update({ password_hash: hash });
    }
    
    // Atualizar email se fornecido
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email já está em uso' });
      }
      await user.update({ email });
    }
    
    res.json({ message: 'Perfil atualizado com sucesso' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { user_id: req.user.id },
      order: [['created_at', 'DESC']],
      limit: 20
    });
    
    res.json(notifications);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findOne({
      where: {
        id,
        user_id: req.user.id
      }
    });
    
    if (!notification) {
      return res.status(404).json({ error: 'Notificação não encontrada' });
    }
    
    await notification.update({ read: true });
    res.json({ message: 'Notificação marcada como lida' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Admin: Listar todos os usuários (apenas para admin)
export const listUsers = async (req, res) => {
  try {
    // Verificar se é admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    const users = await User.findAll({
      include: [{ model: Partner, attributes: ['id', 'name'] }],
      attributes: { exclude: ['password_hash'] }
    });
    
    res.json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Admin: Criar novo usuário
export const createUser = async (req, res) => {
  try {
    // Verificar se é admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    const { email, password, role, partner_id, permissions } = req.body;
    
    // Verificar se usuário já existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }
    
    // Hash da senha
    const hash = await bcrypt.hash(password, 10);
    
    // Criar usuário
    const user = await User.create({
      email,
      password_hash: hash,
      role,
      partner_id,
      permissions,
      status: 'active'
    });
    
    res.status(201).json({
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Admin: Atualizar usuário
export const updateUser = async (req, res) => {
  try {
    // Verificar se é admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    const { id } = req.params;
    const { email, role, partner_id, status, permissions } = req.body;
    
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    // Atualizar campos
    await user.update({
      email: email || user.email,
      role: role || user.role,
      partner_id: partner_id || user.partner_id,
      status: status || user.status,
      permissions: permissions || user.permissions
    });
    
    res.json({
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
