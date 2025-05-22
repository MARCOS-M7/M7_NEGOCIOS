
import React, { useState } from 'react';
import axios from 'axios';
import '../styles/LoginForm.css';

export default function LoginForm({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setErro('');
    
    try {
      const res = await axios.post('/api/auth/login', form);
      localStorage.setItem('token', res.data.token);
      onLogin();
    } catch (error) {
      setErro(error.response?.data?.error || 'Login inválido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form-container">
      <div className="login-form-box">
        <h2>M7 NEG</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input 
              id="email"
              type="email" 
              name="email" 
              placeholder="Seu e-mail" 
              value={form.email}
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input 
              id="password"
              type="password" 
              name="password" 
              placeholder="Sua senha" 
              value={form.password}
              onChange={handleChange} 
              required 
            />
          </div>
          
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
          
          {erro && <div className="error-message">{erro}</div>}
          
          <div className="forgot-password">
            <a href="/reset-password">Esqueceu sua senha?</a>
          </div>
        </form>
      </div>
    </div>
  );
}
