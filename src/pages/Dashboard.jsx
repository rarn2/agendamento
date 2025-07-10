// src/pages/Dashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import useDashboardData from '../controller/useDashboardData';

const Dashboard = () => {
  const totais = useDashboardData();
  const navigate = useNavigate();

  const cardStyle = {
    backgroundColor: 'var(--cor-secundaria)',
    color: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    textAlign: 'center',
    cursor: 'pointer',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s ease-in-out',
    flex: 1,
    margin: '10px',
  };

  const cardHoverStyle = {
    transform: 'translateY(-5px)',
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ color: 'var(--cor-primaria)', textAlign: 'center' }}>Dashboard de Agendamentos</h1>

      <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
        <div
          style={cardStyle}
          onMouseEnter={(e) => e.currentTarget.style.transform = cardHoverStyle.transform}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
          onClick={() => navigate('/agendamentos?filter=today')}
        >
          <h2>Agendamentos do Dia</h2>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{totais.dia}</p>
        </div>

        <div
          style={cardStyle}
          onMouseEnter={(e) => e.currentTarget.style.transform = cardHoverStyle.transform}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
          onClick={() => navigate('/agendamentos?filter=week')}
        >
          <h2>Agendamentos da Semana</h2>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{totais.semana}</p>
        </div>

        <div
          style={cardStyle}
          onMouseEnter={(e) => e.currentTarget.style.transform = cardHoverStyle.transform}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
          onClick={() => navigate('/agendamentos?filter=month')}
        >
          <h2>Agendamentos do Mês</h2>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{totais.mes}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
