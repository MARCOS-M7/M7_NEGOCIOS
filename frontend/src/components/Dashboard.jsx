import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [data, setData] = useState({ receivables: 0, payables: 0 });

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(process.env.REACT_APP_API_URL + '/user/me', {
      headers: { Authorization: 'Bearer ' + token }
    })
    .then(res => setUser(res.data))
    .catch(() => setUser(null));

    axios.get(process.env.REACT_APP_API_URL + '/summary', {
      headers: { Authorization: 'Bearer ' + token }
    })
    .then(res => setData(res.data))
    .catch(() => setData({ receivables: 0, payables: 0 }));
  }, []);

  if (!user) return <div>Carregando informações do usuário...</div>;

  return (
    <div>
      <h2>Bem-vindo, {user.email}</h2>
      <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
        <div style={{ padding: '1rem', border: '1px solid #ccc' }}>
          <h3>Recebíveis</h3>
          <p>R$ {data.receivables.toFixed(2)}</p>
        </div>
        <div style={{ padding: '1rem', border: '1px solid #ccc' }}>
          <h3>Pagamentos</h3>
          <p>R$ {data.payables.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}