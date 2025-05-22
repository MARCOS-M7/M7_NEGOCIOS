import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Configuração do Sequelize para PostgreSQL
export const sequelize = new Sequelize(
  process.env.DB_NAME || 'postgres',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'postgres',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    dialectOptions: {
      ssl: process.env.DB_SSL === 'true' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
      underscored: true,
      timestamps: true
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Testar conexão
export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
    return true;
  } catch (error) {
    console.error('Não foi possível conectar ao banco de dados:', error);
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
export { 
  User, 
  Partner, 
  Attendance, 
  AuditLog, 
  Payable, 
  Receivable 
};

export { default as Notification } from './notification.js';