
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/Header.css';

const Header = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">
            <h1>M7<span>NEG</span></h1>
          </Link>
        </div>
        
        {user && (
          <div className="user-menu">
            <div className="user-info">
              <span className="user-name">{user.name || user.email}</span>
              <span className="user-role">{user.role}</span>
            </div>
            <div className="dropdown-menu">
              <Link to="/profile" className="dropdown-item">Meu Perfil</Link>
              <button onClick={handleLogout} className="dropdown-item logout-btn">Sair</button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Header.css';

const Header = ({ user }) => {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">M7 NEG</Link>
        </div>
        
        <div className="user-menu">
          {user ? (
            <>
              <span className="user-name">Olá, {user.name || 'Usuário'}</span>
              <div className="dropdown">
                <button className="dropdown-button">
                  <i className="fas fa-user-circle"></i>
                </button>
                <div className="dropdown-content">
                  <Link to="/profile">Meu Perfil</Link>
                  <Link to="/settings">Configurações</Link>
                  <button className="logout-button">Sair</button>
                </div>
              </div>
            </>
          ) : (
            <Link to="/login" className="login-button">Entrar</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
