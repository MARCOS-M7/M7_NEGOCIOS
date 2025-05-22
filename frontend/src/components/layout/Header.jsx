
import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Header.css';

const Header = ({ user, onLogout }) => {
  return (
    <header className="app-header">
      <div className="logo">
        <h1>M7 NEG</h1>
      </div>
      <div className="user-area">
        {user ? (
          <>
            <span className="welcome-text">Bem-vindo, {user.name}</span>
            <button onClick={onLogout} className="logout-button">Sair</button>
          </>
        ) : (
          <Link to="/login" className="login-button">Entrar</Link>
        )}
      </div>
    </header>
  );
};

export default Header;
