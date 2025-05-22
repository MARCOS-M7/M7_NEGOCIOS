import React, { useState } from 'react';
import axios from 'axios';
export default function LoginForm({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [erro, setErro] = useState('');
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post(process.env.REACT_APP_API_URL + '/auth/login', form);
      localStorage.setItem('token', res.data.token);
      onLogin();
    } catch {
      setErro('Login inválido');
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <input name="email" placeholder="E-mail" onChange={handleChange} required />
      <input name="password" type="password" placeholder="Senha" onChange={handleChange} required />
      <button type="submit">Entrar</button>
      {erro && <div>{erro}</div>}
    </form>
  );
}