
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase } from './models/index.js';

// Rotas
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import partnerRoutes from './routes/partnerRoutes.js';
import financialRoutes from './routes/financialRoutes.js';
import crmRoutes from './routes/crmRoutes.js';

// Configuração do ambiente
dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Inicializar banco de dados
initDatabase()
  .then((success) => {
    if (!success) {
      console.warn('Aplicação iniciada com avisos sobre o banco de dados.');
    }
  })
  .catch(err => {
    console.error('Falha ao inicializar o banco de dados:', err);
    process.exit(1);
  });

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/financial', financialRoutes);
app.use('/api/crm', crmRoutes);

// Rota de status do servidor
app.get('/api/status', (req, res) => {
  res.json({ status: 'online', timestamp: new Date() });
});

// Rota padrão
app.get('/', (req, res) => {
  res.send('API do Sistema M7NEG - Acesse /api/status para informações.');
});

// Tratamento de rotas não encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Tratamento global de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

export default app;
