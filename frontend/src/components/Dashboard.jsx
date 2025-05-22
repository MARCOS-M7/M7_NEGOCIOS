import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Dashboard.css';

function Dashboard({ user }) {
  const [stats, setStats] = useState({
    partnersCount: 0,
    receivablesAmount: 0,
    payablesAmount: 0,
    pendingAttendances: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Obter dados do dashboard através da API
        const response = await axios.get('/api/dashboard', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        setStats(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Erro ao carregar dashboard:', err);
        setError('Não foi possível carregar os dados do dashboard');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="dashboard-loading">Carregando dados...</div>;
  }

  if (error) {
    return <div className="dashboard-error">{error}</div>;
  }

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <p>Bem-vindo, {user?.email || 'Usuário'}!</p>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>Parceiros</h3>
          <div className="card-value">{stats.partnersCount}</div>
          <div className="card-icon">
            <i className="fas fa-handshake"></i>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>A Receber</h3>
          <div className="card-value">R$ {stats.receivablesAmount.toFixed(2)}</div>
          <div className="card-icon">
            <i className="fas fa-money-bill-wave"></i>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>A Pagar</h3>
          <div className="card-value">R$ {stats.payablesAmount.toFixed(2)}</div>
          <div className="card-icon">
            <i className="fas fa-file-invoice-dollar"></i>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Atendimentos Pendentes</h3>
          <div className="card-value">{stats.pendingAttendances}</div>
          <div className="card-icon">
            <i className="fas fa-comments"></i>
          </div>
        </div>
      </div>

      <div className="action-buttons">
        <a href="/partners/new" className="action-button">
          <i className="fas fa-plus"></i> Novo Parceiro
        </a>

        <a href="/financial/receivables/new" className="action-button">
          <i className="fas fa-plus"></i> Nova Conta a Receber
        </a>

        <a href="/financial/payables/new" className="action-button">
          <i className="fas fa-plus"></i> Nova Conta a Pagar
        </a>

        <a href="/crm/new" className="action-button">
          <i className="fas fa-plus"></i> Novo Atendimento
        </a>
      </div>
    </div>
  );
};

export default Dashboard;