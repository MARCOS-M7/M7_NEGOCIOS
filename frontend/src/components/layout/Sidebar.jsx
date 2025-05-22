import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUsers, FaMoneyBillWave, FaHeadset, FaChartBar, FaCog } from 'react-icons/fa';
import '../../styles/Sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link to="/" className={location.pathname === '/' ? 'nav-item active' : 'nav-item'}>
              <FaHome />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/partners" className={location.pathname.startsWith('/partners') ? 'nav-item active' : 'nav-item'}>
              <FaUsers />
              <span>Parceiros</span>
            </Link>
          </li>
          <li>
            <Link to="/financial/receivables" className={location.pathname.includes('/receivables') ? 'nav-item active' : 'nav-item'}>
              <FaMoneyBillWave />
              <span>Contas a Receber</span>
            </Link>
          </li>
          <li>
            <Link to="/financial/payables" className={location.pathname.includes('/payables') ? 'nav-item active' : 'nav-item'}>
              <FaMoneyBillWave />
              <span>Contas a Pagar</span>
            </Link>
          </li>
          <li>
            <Link to="/crm" className={location.pathname.startsWith('/crm') ? 'nav-item active' : 'nav-item'}>
              <FaHeadset />
              <span>CRM</span>
            </Link>
          </li>
          <li>
            <Link to="/reports" className={location.pathname.startsWith('/reports') ? 'nav-item active' : 'nav-item'}>
              <FaChartBar />
              <span>Relatórios</span>
            </Link>
          </li>
          <li>
            <Link to="/settings" className={location.pathname.startsWith('/settings') ? 'nav-item active' : 'nav-item'}>
              <FaCog />
              <span>Configurações</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;