
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

// Configuração do Supabase
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Configuração do Sequelize
const dbConfig = {
  dialect: 'postgres',
  host: process.env.SUPABASE_URL ? new URL(process.env.SUPABASE_URL).hostname : 'localhost',
  port: 5432,
  username: 'postgres',
  password: process.env.SUPABASE_SERVICE_KEY || '',
  database: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: process.env.NODE_ENV === 'development' ? console.log : false
};

export const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    port: dbConfig.port,
    dialectOptions: dbConfig.dialectOptions,
    logging: dbConfig.logging
  }
);

// Função para inicializar o banco de dados
export const initDatabase = async () => {
  try {
    // Testar a conexão
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');

    // Sincronizar os modelos com o banco de dados
    // Em ambiente de produção, remova o { force: true } para evitar perda de dados
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('Modelos sincronizados com o banco de dados.');
    
    return true;
  } catch (error) {
    console.error('Erro ao conectar com o banco de dados:', error);
    return false;
  }
};

// Importar e associar os modelos
import User from './user.js';
import Partner from './partner.js';
import Notification from './notification.js';
import Attendance from './attendance.js';
import AuditLog from './auditLog.js';
import Payable from './payable.js';
import Receivable from './receivable.js';

// Exportar todos os modelos
export { User, Partner, Notification, Attendance, AuditLog, Payable, Receivable };
