import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import './styles/index.css';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se o usuário está autenticado
    const token = localStorage.getItem('token');
    if (token) {
      // Aqui você pode fazer uma chamada para validar o token no servidor
      // Por enquanto, vamos apenas simular um usuário autenticado
      setUser({ name: 'Usuário Teste', email: 'usuario@teste.com' });
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('token', userData.token);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <Router>
      <div className="app">
        <Header user={user} onLogout={handleLogout} />

        <div className="main-container">
          {user && <Sidebar />}

          <main className="content">
            <Routes>
              <Route 
                path="/login" 
                element={user ? <Navigate to="/" /> : <LoginForm onLogin={handleLogin} />} 
              />
              <Route 
                path="/" 
                element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} 
              />
              {/* Adicione outras rotas aqui */}
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;