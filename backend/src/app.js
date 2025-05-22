
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { sequelize } from './models/index.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import partnerRoutes from './routes/partnerRoutes.js';
import financialRoutes from './routes/financialRoutes.js';
import crmRoutes from './routes/crmRoutes.js';
import rateLimiter from './middlewares/rateLimiter.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(rateLimiter);

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/financial', financialRoutes);
app.use('/api/crm', crmRoutes);

app.get('/health', (req, res) => res.json({ status: 'OK' }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 4000;
sequelize.sync().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`M7NEG backend rodando na porta ${PORT}`);
  });
});
