
import { DataTypes } from "sequelize";
import { sequelize } from "./index.js";

export const Partner = sequelize.define('Partner', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  document: { 
    type: DataTypes.STRING(18), 
    unique: true,
    allowNull: true
  },
  type: { 
    type: DataTypes.STRING(10), 
    allowNull: false 
  },
  parent_id: { 
    type: DataTypes.INTEGER, 
    allowNull: true 
  },
  active: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: true 
  }
}, { 
  tableName: 'partners', 
  timestamps: true, 
  createdAt: 'created_at', 
  updatedAt: false 
});
