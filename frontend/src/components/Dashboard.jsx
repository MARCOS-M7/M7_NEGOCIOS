
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const [user, setUser] = useState(null);
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
        // Buscar dados do usuário
        const userRes = await axios.get('/api/user/me');
        setUser(userRes.data);
        
        // Buscar resumo financeiro
        const summaryRes = await axios.get('/api/financial/summary');
        setSummary(summaryRes.data);
        
        // Buscar atendimentos recentes
        const attendancesRes = await axios.get('/api/crm/attendances', {
          params: { limit: 5 }
        });
        setRecentAttendances(attendancesRes.data);
        
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
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      
      <div className="welcome-section">
        <h2>Bem-vindo, {user?.email}</h2>
        <p>Aqui está um resumo do seu sistema:</p>
      </div>
      
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>Recebíveis em Aberto</h3>
          <div className="card-value">R$ {summary.receivables?.Aberto?.amount.toFixed(2) || '0.00'}</div>
          <div className="card-info">{summary.receivables?.Aberto?.count || 0} contas a receber</div>
          <Link to="/receivables" className="card-link">Ver detalhes</Link>
        </div>
        
        <div className="dashboard-card">
          <h3>Pagamentos em Aberto</h3>
          <div className="card-value">R$ {summary.payables?.Aberto?.amount.toFixed(2) || '0.00'}</div>
          <div className="card-info">{summary.payables?.Aberto?.count || 0} contas a pagar</div>
          <Link to="/payables" className="card-link">Ver detalhes</Link>
        </div>
        
        <div className="dashboard-card">
          <h3>Total de Parceiros</h3>
          <div className="card-value">{user?.partner_count || 0}</div>
          <div className="card-info">Parceiros cadastrados</div>
          <Link to="/partners" className="card-link">Gerenciar parceiros</Link>
        </div>
      </div>
      
      <div className="dashboard-section">
        <h3>Atendimentos Recentes</h3>
        {recentAttendances.length > 0 ? (
          <ul className="attendance-list">
            {recentAttendances.map(attendance => (
              <li key={attendance.id} className={`attendance-item status-${attendance.status.toLowerCase()}`}>
                <div className="attendance-info">
                  <span className="attendance-partner">{attendance.Partner?.name}</span>
                  <span className="attendance-status">{attendance.status}</span>
                </div>
                <div className="attendance-date">
                  {new Date(attendance.created_at).toLocaleDateString('pt-BR')}
                </div>
                <Link to={`/crm/${attendance.id}`} className="attendance-link">
                  Ver detalhes
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhum atendimento recente encontrado.</p>
        )}
        <div className="section-footer">
          <Link to="/crm" className="view-all-link">Ver todos os atendimentos</Link>
        </div>
      </div>
      
      <div className="dashboard-actions">
        <h3>Ações Rápidas</h3>
        <div className="action-buttons">
          <Link to="/receivables/new" className="action-button">
            Novo Recebível
          </Link>
          <Link to="/payables/new" className="action-button">
            Novo Pagamento
          </Link>
          <Link to="/partners/new" className="action-button">
            Novo Parceiro
          </Link>
          <Link to="/crm/new" className="action-button">
            Novo Atendimento
          </Link>
        </div>
      </div>
    </div>
  );
}
