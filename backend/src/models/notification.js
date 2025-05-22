
import { DataTypes } from "sequelize";
import { sequelize } from "./index.js";

export const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  message: { 
    type: DataTypes.TEXT, 
    allowNull: false 
  },
  type: { 
    type: DataTypes.STRING(20), 
    allowNull: true 
  },
  read: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: false 
  }
}, { 
  tableName: 'notifications', 
  timestamps: true, 
  createdAt: 'created_at', 
  updatedAt: false 
});
