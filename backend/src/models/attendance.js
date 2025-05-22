
import { DataTypes } from "sequelize";
import { sequelize } from "./index.js";

const Attendance = sequelize.define('Attendance', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  partner_id: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  status: { 
    type: DataTypes.STRING(30), 
    defaultValue: 'Aguardando' 
  },
  logs: { 
    type: DataTypes.JSONB, 
    allowNull: true 
  }
}, { 
  tableName: 'attendimentos', 
  timestamps: true, 
  createdAt: 'created_at', 
  updatedAt: false 
});

export { Attendance };
export default Attendance;
