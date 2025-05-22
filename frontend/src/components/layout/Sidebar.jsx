
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUsers, FaMoneyBillWave, FaHeadset, FaChartBar, FaCog } from 'react-icons/fa';
import '../../styles/Sidebar.css';

const Sidebar = ({ user }) => {
  const location = useLocation();
  
  const isAdmin = user && user.role === 'admin';
  
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <ul>
          <li className={isActive('/')}>
            <Link to="/">
              <FaHome />
              <span>Dashboard</span>
            </Link>
          </li>
          <li className={location.pathname.includes('/partners') ? 'active' : ''}>
            <Link to="/partners">
              <FaUsers />
              <span>Parceiros</span>
            </Link>
          </li>
          <li className={location.pathname.includes('/receivables') ? 'active' : ''}>
            <Link to="/receivables">
              <FaMoneyBillWave />
              <span>Recebíveis</span>
            </Link>
          </li>
          <li className={location.pathname.includes('/payables') ? 'active' : ''}>
            <Link to="/payables">
              <FaMoneyBillWave />
              <span>Pagamentos</span>
            </Link>
          </li>
          <li className={location.pathname.includes('/crm') ? 'active' : ''}>
            <Link to="/crm">
              <FaHeadset />
              <span>Atendimentos</span>
            </Link>
          </li>
          <li className={location.pathname.includes('/reports') ? 'active' : ''}>
            <Link to="/reports">
              <FaChartBar />
              <span>Relatórios</span>
            </Link>
          </li>
          
          {isAdmin && (
            <li className={location.pathname.includes('/users') ? 'active' : ''}>
              <Link to="/users">
                <FaCog />
                <span>Usuários</span>
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link to="/" className="nav-item">
              <i className="fas fa-home"></i>
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/partners" className="nav-item">
              <i className="fas fa-handshake"></i>
              <span>Parceiros</span>
            </Link>
          </li>
          <li>
            <Link to="/financial/receivables" className="nav-item">
              <i className="fas fa-money-bill-wave"></i>
              <span>Contas a Receber</span>
            </Link>
          </li>
          <li>
            <Link to="/financial/payables" className="nav-item">
              <i className="fas fa-file-invoice-dollar"></i>
              <span>Contas a Pagar</span>
            </Link>
          </li>
          <li>
            <Link to="/crm" className="nav-item">
              <i className="fas fa-headset"></i>
              <span>CRM</span>
            </Link>
          </li>
          <li>
            <Link to="/reports" className="nav-item">
              <i className="fas fa-chart-bar"></i>
              <span>Relatórios</span>
            </Link>
          </li>
          <li>
            <Link to="/users" className="nav-item">
              <i className="fas fa-users"></i>
              <span>Usuários</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
