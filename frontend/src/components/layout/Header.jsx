import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Header.css';
import { FaUserCircle, FaCog, FaSignOutAlt } from 'react-icons/fa';

const Header = ({ user, onLogout }) => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">
            <h1>M7<span>NEG</span></h1>
          </Link>
        </div>

        {user ? (
          <div className="user-menu">
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className="user-role">{user.role || 'Usuário'}</span>
            </div>
            <FaUserCircle size={24} />

            <div className="dropdown-menu">
              <Link to="/profile" className="dropdown-item">
                <FaUserCircle /> Perfil
              </Link>
              <Link to="/settings" className="dropdown-item">
                <FaCog /> Configurações
              </Link>
              <button onClick={onLogout} className="dropdown-item logout-btn">
                <FaSignOutAlt /> Sair
              </button>
            </div>
          </div>
        ) : (
          <Link to="/login" className="login-button">Entrar</Link>
        )}
      </div>
    </header>
  );
};

export default Header;