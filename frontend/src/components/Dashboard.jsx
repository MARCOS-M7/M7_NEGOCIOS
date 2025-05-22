import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Dashboard.css';

export default function Dashboard({ user }) {
  const [summary, setSummary] = useState({
    receivables: { Aberto: { count: 0, amount: 0 } },
    payables: { Aberto: { count: 0, amount: 0 } }
  });
  const [recentAttendances, setRecentAttendances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Em um ambiente real, essas chamadas API estariam funcionando
        // Por enquanto, vamos simular dados para exibição
        setSummary({
          receivables: { 
            Aberto: { count: 5, amount: 12500.00 },
            Recebido: { count: 3, amount: 7800.00 }
          },
          payables: { 
            Aberto: { count: 3, amount: 4300.00 },
            Pago: { count: 2, amount: 2700.00 }
          }
        });

        setRecentAttendances([
          { id: 1, client_name: 'Empresa ABC', subject: 'Dúvida sobre fatura', status: 'Aberto', created_at: '2023-07-15' },
          { id: 2, client_name: 'João Silva', subject: 'Problema com produto', status: 'Em andamento', created_at: '2023-07-14' },
          { id: 3, client_name: 'Distribuidora XYZ', subject: 'Solicitação de prazo', status: 'Resolvido', created_at: '2023-07-13' }
        ]);
      } catch (err) {
        console.error('Erro ao carregar dashboard:', err);
        setError('Não foi possível carregar os dados do dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="dashboard-loading">Carregando dados...</div>;
  if (error) return <div className="dashboard-error">{error}</div>;

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <p>Bem-vindo(a), {user?.name || 'Usuário'}!</p>

      <div className="dashboard-cards">
        <div className="card financial-summary">
          <h2>Resumo Financeiro</h2>
          <div className="financial-stats">
            <div className="stat-box">
              <h3>A Receber</h3>
              <div className="stat-value">R$ {summary.receivables.Aberto.amount.toFixed(2)}</div>
              <div className="stat-count">{summary.receivables.Aberto.count} faturas</div>
            </div>
            <div className="stat-box">
              <h3>A Pagar</h3>
              <div className="stat-value">R$ {summary.payables.Aberto.amount.toFixed(2)}</div>
              <div className="stat-count">{summary.payables.Aberto.count} contas</div>
            </div>
          </div>
          <div className="card-actions">
            <Link to="/financial/receivables" className="btn">
              Ver Contas a Receber
            </Link>
            <Link to="/financial/payables" className="btn">
              Ver Contas a Pagar
            </Link>
          </div>
        </div>

        <div className="card recent-attendances">
          <h2>Atendimentos Recentes</h2>
          <ul className="attendance-list">
            {recentAttendances.map(attendance => (
              <li key={attendance.id} className={`attendance-item status-${attendance.status.toLowerCase().replace(' ', '-')}`}>
                <div className="attendance-header">
                  <span className="client-name">{attendance.client_name}</span>
                  <span className="attendance-date">{attendance.created_at}</span>
                </div>
                <div className="attendance-subject">{attendance.subject}</div>
                <div className="attendance-status">{attendance.status}</div>
              </li>
            ))}
          </ul>
          <div className="card-actions">
            <Link to="/crm/attendances" className="btn">
              Ver Todos
            </Link>
            <Link to="/crm/attendances/new" className="btn">
              Novo Atendimento
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}