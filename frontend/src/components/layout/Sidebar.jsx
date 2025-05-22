import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Sidebar.css';

function Sidebar({ user }) {
  // Se não tiver usuário logado, não mostra o sidebar
  if (!user) return null;
  
  // Definir menus baseados no perfil do usuário
  const isAdmin = user.role === 'admin';

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link to="/dashboard" className="nav-link">
              <i className="fas fa-tachometer-alt"></i>
              <span>Dashboard</span>
            </Link>
          </li>
          
          <li>
            <Link to="/partners" className="nav-link">
              <i className="fas fa-handshake"></i>
              <span>Parceiros</span>
            </Link>
          </li>
          
          <li>
            <Link to="/financial/receivables" className="nav-link">
              <i className="fas fa-money-bill-wave"></i>
              <span>Contas a Receber</span>
            </Link>
          </li>
          
          <li>
            <Link to="/financial/payables" className="nav-link">
              <i className="fas fa-file-invoice-dollar"></i>
              <span>Contas a Pagar</span>
            </Link>
          </li>
          
          <li>
            <Link to="/crm" className="nav-link">
              <i className="fas fa-comments"></i>
              <span>Atendimentos</span>
            </Link>
          </li>
          
          {isAdmin && (
            <li>
              <Link to="/users" className="nav-link">
                <i className="fas fa-users"></i>
                <span>Usuários</span>
              </Link>
            </li>
          )}
          
          {isAdmin && (
            <li>
              <Link to="/reports" className="nav-link">
                <i className="fas fa-chart-bar"></i>
                <span>Relatórios</span>
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;