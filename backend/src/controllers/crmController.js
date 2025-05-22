
import { Attendance, Partner, User, Notification } from '../models/index.js';

export const listAttendances = async (req, res) => {
  try {
    const { status, partner_id } = req.query;
    const where = {};
    
    if (status) {
      where.status = status;
    }
    
    if (partner_id) {
      where.partner_id = partner_id;
    }
    
    const attendances = await Attendance.findAll({
      where,
      include: [{ model: Partner, attributes: ['id', 'name'] }],
      order: [['created_at', 'DESC']]
    });
    
    res.json(attendances);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    
    const attendance = await Attendance.findByPk(id, {
      include: [{ model: Partner, attributes: ['id', 'name', 'document'] }]
    });
    
    if (!attendance) {
      return res.status(404).json({ error: 'Atendimento não encontrado' });
    }
    
    res.json(attendance);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const createAttendance = async (req, res) => {
  try {
    const { partner_id, initial_message, initial_status } = req.body;
    
    // Verificar se o parceiro existe
    const partner = await Partner.findByPk(partner_id);
    if (!partner) {
      return res.status(404).json({ error: 'Parceiro não encontrado' });
    }
    
    // Criar log inicial
    const initialLog = {
      timestamp: new Date(),
      user_id: req.user.id,
      user_email: req.user.email,
      message: initial_message || 'Atendimento iniciado',
      status: initial_status || 'Aguardando'
    };
    
    // Criar atendimento
    const attendance = await Attendance.create({
      partner_id,
      status: initial_status || 'Aguardando',
      logs: [initialLog]
    });
    
    // Notificar usuários responsáveis pelo parceiro
    const users = await User.findAll({
      where: { 
        partner_id: partner.parent_id || partner.id,
        role: { [Op.in]: ['admin', 'manager'] }
      }
    });
    
    // Criar notificações
    const notifications = users.map(user => ({
      user_id: user.id,
      message: `Novo atendimento para ${partner.name}`,
      type: 'crm'
    }));
    
    if (notifications.length > 0) {
      await Notification.bulkCreate(notifications);
    }
    
    res.status(201).json(attendance);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, message } = req.body;
    
    const attendance = await Attendance.findByPk(id);
    if (!attendance) {
      return res.status(404).json({ error: 'Atendimento não encontrado' });
    }
    
    // Criar novo log
    const newLog = {
      timestamp: new Date(),
      user_id: req.user.id,
      user_email: req.user.email,
      message: message || `Status alterado para ${status}`,
      status: status || attendance.status
    };
    
    const logs = [...(attendance.logs || []), newLog];
    
    // Atualizar atendimento
    await attendance.update({
      status: status || attendance.status,
      logs
    });
    
    res.json(attendance);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const closeAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { resolution_message } = req.body;
    
    const attendance = await Attendance.findByPk(id);
    if (!attendance) {
      return res.status(404).json({ error: 'Atendimento não encontrado' });
    }
    
    // Criar log de encerramento
    const closingLog = {
      timestamp: new Date(),
      user_id: req.user.id,
      user_email: req.user.email,
      message: resolution_message || 'Atendimento concluído',
      status: 'Concluído'
    };
    
    const logs = [...(attendance.logs || []), closingLog];
    
    // Atualizar atendimento
    await attendance.update({
      status: 'Concluído',
      logs
    });
    
    res.json(attendance);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
