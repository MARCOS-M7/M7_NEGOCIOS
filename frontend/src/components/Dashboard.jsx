
import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css';
import { FaUsers, FaMoneyBillWave, FaHeadset, FaChartPie } from 'react-icons/fa';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';

// Registrar componentes do ChartJS
ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = ({ user }) => {
  const [summary, setSummary] = useState({
    partners: { total: 0, active: 0 },
    financial: { 
      receivables: { open: 0, overdue: 0, paid: 0 },
      payables: { open: 0, overdue: 0, paid: 0 }
    },
    attendance: { open: 0, inProgress: 0, closed: 0 }
  });

  useEffect(() => {
    // Aqui você faria chamadas à API para obter os dados reais
    // Por enquanto, vamos usar dados simulados
    setSummary({
      partners: { total: 42, active: 38 },
      financial: { 
        receivables: { open: 12, overdue: 3, paid: 78 },
        payables: { open: 8, overdue: 1, paid: 45 }
      },
      attendance: { open: 5, inProgress: 3, closed: 27 }
    });
  }, []);

  const financialData = {
    labels: ['A Receber', 'Recebido', 'A Pagar', 'Pago'],
    datasets: [
      {
        label: 'Valores (R$)',
        data: [
          summary.financial.receivables.open + summary.financial.receivables.overdue,
          summary.financial.receivables.paid,
          summary.financial.payables.open + summary.financial.payables.overdue,
          summary.financial.payables.paid
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(153, 102, 255, 0.6)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  // Dados simulados para o gráfico de linha
  const monthlyData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
      {
        label: 'Receitas',
        data: [12000, 19000, 15000, 25000, 22000, 30000],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
      {
        label: 'Despesas',
        data: [8000, 12000, 10000, 18000, 15000, 20000],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <p className="welcome-message">Bem-vindo, {user?.name || 'Usuário'}!</p>
      
      <div className="dashboard-summary">
        <div className="summary-card">
          <div className="card-icon partners">
            <FaUsers />
          </div>
          <div className="card-content">
            <h3>Parceiros</h3>
            <p className="card-number">{summary.partners.total}</p>
            <p className="card-detail">
              <span className="highlight">{summary.partners.active}</span> ativos
            </p>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="card-icon receivables">
            <FaMoneyBillWave />
          </div>
          <div className="card-content">
            <h3>Recebíveis</h3>
            <p className="card-number">{summary.financial.receivables.open + summary.financial.receivables.overdue + summary.financial.receivables.paid}</p>
            <p className="card-detail">
              <span className="highlight">{summary.financial.receivables.overdue}</span> em atraso
            </p>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="card-icon payables">
            <FaMoneyBillWave />
          </div>
          <div className="card-content">
            <h3>Pagamentos</h3>
            <p className="card-number">{summary.financial.payables.open + summary.financial.payables.overdue + summary.financial.payables.paid}</p>
            <p className="card-detail">
              <span className="highlight">{summary.financial.payables.overdue}</span> em atraso
            </p>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="card-icon attendance">
            <FaHeadset />
          </div>
          <div className="card-content">
            <h3>Atendimentos</h3>
            <p className="card-number">{summary.attendance.open + summary.attendance.inProgress + summary.attendance.closed}</p>
            <p className="card-detail">
              <span className="highlight">{summary.attendance.open}</span> abertos
            </p>
          </div>
        </div>
      </div>
      
      <div className="dashboard-charts">
        <div className="chart-container">
          <h3>Financeiro</h3>
          <div className="chart">
            <Pie data={financialData} />
          </div>
        </div>
        
        <div className="chart-container">
          <h3>Histórico Mensal</h3>
          <div className="chart">
            <Line 
              data={monthlyData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: 'Receitas x Despesas'
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
