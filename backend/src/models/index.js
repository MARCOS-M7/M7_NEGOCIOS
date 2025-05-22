
import { Sequelize } from "sequelize";
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
  }
);

// Importar e exportar todos os modelos
import { User } from './user.js';
import { Partner } from './partner.js';
import { Receivable } from './receivable.js';
import { Payable } from './payable.js';
import { Attendance } from './attendance.js';
import { Notification } from './notification.js';
import { AuditLog } from './auditLog.js';

// Definir relacionamentos
User.belongsTo(Partner, { foreignKey: 'partner_id' });
Partner.hasMany(User, { foreignKey: 'partner_id' });

Receivable.belongsTo(Partner, { foreignKey: 'partner_id' });
Partner.hasMany(Receivable, { foreignKey: 'partner_id' });

Payable.belongsTo(Partner, { foreignKey: 'partner_id' });
Partner.hasMany(Payable, { foreignKey: 'partner_id' });

Attendance.belongsTo(Partner, { foreignKey: 'partner_id' });
Partner.hasMany(Attendance, { foreignKey: 'partner_id' });

Notification.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Notification, { foreignKey: 'user_id' });

AuditLog.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(AuditLog, { foreignKey: 'user_id' });

export {
  User,
  Partner,
  Receivable,
  Payable,
  Attendance,
  Notification,
  AuditLog
};
