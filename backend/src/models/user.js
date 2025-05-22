
import { DataTypes } from "sequelize";
import { sequelize } from "./index.js";

export const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: { 
    type: DataTypes.STRING, 
    unique: true, 
    allowNull: false 
  },
  password_hash: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  role: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  partner_id: { 
    type: DataTypes.INTEGER, 
    allowNull: true 
  },
  status: { 
    type: DataTypes.STRING, 
    defaultValue: 'pending' 
  },
  permissions: { 
    type: DataTypes.JSONB, 
    allowNull: true 
  },
}, { 
  tableName: 'users', 
  timestamps: true, 
  createdAt: 'created_at', 
  updatedAt: false 
});
