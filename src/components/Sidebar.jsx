// src/components/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      height: '100%',
      width: isOpen ? '250px' : '0',
      backgroundColor: 'var(--cor-primaria)',
      overflowX: 'hidden',
      transition: '0.3s',
      paddingTop: '60px',
      zIndex: 1000,
      boxShadow: isOpen ? '2px 0 5px rgba(0,0,0,0.5)' : 'none',
    }}>
      <a
        href="javascript:void(0)"
        style={{
          position: 'absolute',
          top: 0,
          right: '25px',
          fontSize: '36px',
          marginLeft: '50px',
          color: 'white',
          textDecoration: 'none',
        }}
        onClick={toggleSidebar}
      >
        &times;
      </a>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Link to="/" onClick={toggleSidebar} style={{
          padding: '15px 25px',
          textDecoration: 'none',
          fontSize: '20px',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          whiteSpace: 'nowrap',
        }}>
          <span role="img" aria-label="dashboard">&#x1F4CA;</span> {/* Gráfico de barras */}
          <span className="sidebar-text">Dashboard</span>
        </Link>
        <Link to="/pacientes" onClick={toggleSidebar} style={{
          padding: '15px 25px',
          textDecoration: 'none',
          fontSize: '20px',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          whiteSpace: 'nowrap',
        }}>
          <span role="img" aria-label="pacientes">&#x1F464;</span> {/* Silhueta de pessoa */}
          <span className="sidebar-text">Pacientes</span>
        </Link>
        <Link to="/locais" onClick={toggleSidebar} style={{
          padding: '15px 25px',
          textDecoration: 'none',
          fontSize: '20px',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          whiteSpace: 'nowrap',
        }}>
          <span role="img" aria-label="locais">&#x1F4CD;</span> {/* Alfinete de mapa */}
          <span className="sidebar-text">Locais</span>
        </Link>
        <Link to="/agendamentos" onClick={toggleSidebar} style={{
          padding: '15px 25px',
          textDecoration: 'none',
          fontSize: '20px',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          whiteSpace: 'nowrap',
        }}>
          <span role="img" aria-label="agendamentos">&#x1F4C5;</span> {/* Calendário */}
          <span className="sidebar-text">Agendamentos</span>
        </Link>
        <Link to="/configuracoes" onClick={toggleSidebar} style={{
          padding: '15px 25px',
          textDecoration: 'none',
          fontSize: '20px',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          whiteSpace: 'nowrap',
        }}>
          <span role="img" aria-label="configuracoes">&#x2699;&#xFE0F;</span> {/* Engrenagem */}
          <span className="sidebar-text">Configurações</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;