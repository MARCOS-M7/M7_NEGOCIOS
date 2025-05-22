
import { DataTypes } from "sequelize";
import { sequelize } from "./index.js";

export const AuditLog = sequelize.define('AuditLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: { 
    type: DataTypes.INTEGER, 
    allowNull: true 
  },
  table_name: { 
    type: DataTypes.TEXT, 
    allowNull: false 
  },
  action: { 
    type: DataTypes.TEXT, 
    allowNull: false 
  },
  record_id: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  changes: { 
    type: DataTypes.JSONB, 
    allowNull: true 
  }
}, { 
  tableName: 'audit_logs', 
  timestamps: true, 
  createdAt: 'created_at', 
  updatedAt: false 
});
