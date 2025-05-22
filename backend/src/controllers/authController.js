
import { User } from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

// Configuração do transportador de email
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

export const register = async (req, res) => {
  try {
    const { email, password, role, partner_id } = req.body;
    
    // Verificar se usuário já existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }
    
    // Criar hash da senha
    const hash = await bcrypt.hash(password, 10);
    
    // Criar usuário
    const user = await User.create({ 
      email, 
      password_hash: hash, 
      role,
      partner_id,
      status: 'pending'
    });
    
    // Enviar email de boas-vindas
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Bem-vindo ao M7 NEG',
      html: `<p>Olá! Sua conta foi criada com sucesso.</p><p>Acesse o sistema com seu email e senha.</p>`
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

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Buscar usuário
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }
    
    // Verificar status
    if (user.status !== 'active' && user.status !== 'pending') {
      return res.status(403).json({ error: 'Conta inativa ou bloqueada' });
    }
    
    // Verificar senha
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Senha inválida' });
    }
    
    // Gerar token JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role,
        partner_id: user.partner_id
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );
    
    // Atualizar status para ativo se estiver pendente
    if (user.status === 'pending') {
      await user.update({ status: 'active' });
    }
    
    res.json({ 
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Buscar usuário
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // Por segurança, não revelar se o email existe ou não
      return res.json({ message: 'Se o email estiver registrado, você receberá instruções para redefinir sua senha.' });
    }
    
    // Gerar token temporário
    const resetToken = jwt.sign(
      { id: user.id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );
    
    // Enviar email com link para redefinir senha
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Redefinição de senha M7 NEG',
      html: `
        <p>Você solicitou a redefinição de senha.</p>
        <p>Clique no link abaixo para criar uma nova senha:</p>
        <a href="${process.env.FRONTEND_URL}/reset-password/${resetToken}">Redefinir senha</a>
        <p>Este link é válido por 1 hora.</p>
      `
    });
    
    res.json({ message: 'Se o email estiver registrado, você receberá instruções para redefinir sua senha.' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
