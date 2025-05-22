
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

// Componentes de Layout
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';

// Páginas
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import Partners from './pages/Partners';
import PartnerForm from './pages/PartnerForm';
import PartnerDetails from './pages/PartnerDetails';
import Receivables from './pages/Receivables';
import ReceivableForm from './pages/ReceivableForm';
import Payables from './pages/Payables';
import PayableForm from './pages/PayableForm';
import CRM from './pages/CRM';
import AttendanceDetail from './pages/AttendanceDetail';
import Profile from './pages/Profile';
import Users from './pages/Users';
import UserForm from './pages/UserForm';
import Reports from './pages/Reports';

// Configuração global do axios
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:4000';RL;

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await axios.get('/user/me');
      setUser(res.data);
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUserData();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  // Componente para rotas protegidas
  const PrivateRoute = ({ children }) => {
    if (loading) return <div>Carregando...</div>;
    return user ? children : <Navigate to="/login" />;
  };

  // Componente para rotas de administrador
  const AdminRoute = ({ children }) => {
    if (loading) return <div>Carregando...</div>;
    return user && user.role === 'admin' ? children : <Navigate to="/dashboard" />;
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <Router>
      <div className="app">
        {user && (
          <>
            <Header user={user} onLogout={handleLogout} />
            <Sidebar user={user} />
          </>
        )}

        <main className={user ? 'main-content' : 'main-content-full'}>
          <Routes>
            {/* Rotas públicas */}
            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} />
            <Route path="/reset-password/:token?" element={user ? <Navigate to="/dashboard" /> : <ResetPassword />} />

            {/* Rotas protegidas */}
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile user={user} /></PrivateRoute>} />
            
            {/* Parceiros */}
            <Route path="/partners" element={<PrivateRoute><Partners /></PrivateRoute>} />
            <Route path="/partners/new" element={<PrivateRoute><PartnerForm /></PrivateRoute>} />
            <Route path="/partners/:id" element={<PrivateRoute><PartnerDetails /></PrivateRoute>} />
            <Route path="/partners/:id/edit" element={<PrivateRoute><PartnerForm /></PrivateRoute>} />
            
            {/* Financeiro */}
            <Route path="/receivables" element={<PrivateRoute><Receivables /></PrivateRoute>} />
            <Route path="/receivables/new" element={<PrivateRoute><ReceivableForm /></PrivateRoute>} />
            <Route path="/receivables/:id/edit" element={<PrivateRoute><ReceivableForm /></PrivateRoute>} />
            
            <Route path="/payables" element={<PrivateRoute><Payables /></PrivateRoute>} />
            <Route path="/payables/new" element={<PrivateRoute><PayableForm /></PrivateRoute>} />
            <Route path="/payables/:id/edit" element={<PrivateRoute><PayableForm /></PrivateRoute>} />
            
            {/* CRM */}
            <Route path="/crm" element={<PrivateRoute><CRM /></PrivateRoute>} />
            <Route path="/crm/:id" element={<PrivateRoute><AttendanceDetail /></PrivateRoute>} />
            
            {/* Relatórios */}
            <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
            
            {/* Rotas de administrador */}
            <Route path="/users" element={<AdminRoute><Users /></AdminRoute>} />
            <Route path="/users/new" element={<AdminRoute><UserForm /></AdminRoute>} />
            <Route path="/users/:id/edit" element={<AdminRoute><UserForm /></AdminRoute>} />
            
            {/* Rota padrão */}
            <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
