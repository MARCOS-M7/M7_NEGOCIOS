
import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Header.css';

function Header({ user, onLogout }) {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">M7 NEG</Link>
        </div>
        
        {user && (
          <div className="user-menu">
            <span className="user-name">{user.email}</span>
            <div className="dropdown">
              <button className="dropdown-button">
                <i className="fas fa-user-circle"></i>
              </button>
              <div className="dropdown-content">
                <Link to="/profile">Meu Perfil</Link>
                <button onClick={onLogout} className="logout-button">
                  Sair
                </button>
              </div>
            </div>
          </div>
        )}
        
        {!user && (
          <Link to="/login" className="login-button">
            Entrar
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;
