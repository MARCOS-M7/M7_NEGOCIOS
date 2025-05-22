
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Configuração da conexão com o banco de dados
export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'db.your-supabase-project.supabase.co',
  port: process.env.DB_PORT || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'your-database-password',
  database: process.env.DB_NAME || 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false
});

// Importar modelos
import { User } from './user.js';
import { Partner } from './partner.js';
import { Receivable } from './receivable.js';
import { Payable } from './payable.js';
import { Attendance } from './attendance.js';
import { Notification } from './notification.js';
import { AuditLog } from './auditLog.js';

// Definir relações
User.belongsTo(Partner, { foreignKey: 'partner_id' });
Partner.hasMany(User, { foreignKey: 'partner_id' });

Partner.hasMany(Receivable, { foreignKey: 'partner_id' });
Receivable.belongsTo(Partner, { foreignKey: 'partner_id' });

Partner.hasMany(Payable, { foreignKey: 'partner_id' });
Payable.belongsTo(Partner, { foreignKey: 'partner_id' });

Partner.hasMany(Attendance, { foreignKey: 'partner_id' });
Attendance.belongsTo(Partner, { foreignKey: 'partner_id' });

User.hasMany(Notification, { foreignKey: 'user_id' });
Notification.belongsTo(User, { foreignKey: 'user_id' });

// Exportar modelos
export { User, Partner, Receivable, Payable, Attendance, Notification, AuditLog };
