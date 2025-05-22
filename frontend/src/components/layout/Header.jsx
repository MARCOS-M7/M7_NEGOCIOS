
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
