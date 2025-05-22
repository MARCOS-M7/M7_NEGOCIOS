
import { DataTypes } from "sequelize";
import { sequelize } from "./index.js";

export const Payable = sequelize.define('Payable', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  partner_id: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  doc_number: { 
    type: DataTypes.STRING(40), 
    allowNull: true 
  },
  issue_date: { 
    type: DataTypes.DATEONLY, 
    allowNull: true 
  },
  due_date: { 
    type: DataTypes.DATEONLY, 
    allowNull: true 
  },
  amount: { 
    type: DataTypes.DECIMAL(15, 2), 
    allowNull: false 
  },
  status: { 
    type: DataTypes.STRING(20), 
    defaultValue: 'Aberto' 
  },
  attachments: { 
    type: DataTypes.JSONB, 
    allowNull: true 
  }
}, { 
  tableName: 'payables', 
  timestamps: true, 
  createdAt: 'created_at', 
  updatedAt: false 
});
