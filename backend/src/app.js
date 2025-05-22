
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './models/index.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import partnerRoutes from './routes/partnerRoutes.js';
import financialRoutes from './routes/financialRoutes.js';
import crmRoutes from './routes/crmRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/financial', financialRoutes);
app.use('/api/crm', crmRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'API do M7 NEG funcionando!' });
});

// Iniciar servidor
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Servidor rodando em http://0.0.0.0:${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao conectar com o banco de dados:', error);
  }
};

startServer();

export default app;
