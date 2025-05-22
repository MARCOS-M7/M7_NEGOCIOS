
import { DataTypes } from "sequelize";
import { sequelize } from "./index.js";

export const Receivable = sequelize.define('Receivable', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  partner_id: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  invoice_number: { 
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
  gross_amount: { 
    type: DataTypes.DECIMAL(15, 2), 
    allowNull: false 
  },
  commission_rate: { 
    type: DataTypes.DECIMAL(5, 2), 
    allowNull: false 
  },
  commission_amount: { 
    type: DataTypes.DECIMAL(15, 2), 
    allowNull: false 
  },
  net_amount: { 
    type: DataTypes.DECIMAL(15, 2), 
    allowNull: false 
  },
  status: { 
    type: DataTypes.STRING(20), 
    defaultValue: 'Aberto' 
  },
  date_received: { 
    type: DataTypes.DATEONLY, 
    allowNull: true 
  },
  attachments: { 
    type: DataTypes.JSONB, 
    allowNull: true 
  }
}, { 
  tableName: 'receivables', 
  timestamps: true, 
  createdAt: 'created_at', 
  updatedAt: false 
});
