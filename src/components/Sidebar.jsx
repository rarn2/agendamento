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
          <span role="img" aria-label="dashboard" style={{ color: 'white' }}>&#9776;</span> {/* Menu Sanduíche (genérico para dashboard) */}
          <span className="sidebar-text-visible">Dashboard</span>
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
          <span role="img" aria-label="pacientes" style={{ color: 'white' }}>&#128100;</span> {/* Silhueta de pessoa */}
          <span className="sidebar-text-visible">Pacientes</span>
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
          <span role="img" aria-label="locais" style={{ color: 'white' }}>&#128205;</span> {/* Alfinete de mapa */}
          <span className="sidebar-text-visible">Locais</span>
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
          <span role="img" aria-label="agendamentos" style={{ color: 'white' }}>&#128197;</span> {/* Calendário */}
          <span className="sidebar-text-visible">Agendamentos</span>
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
          <span role="img" aria-label="configuracoes" style={{ color: 'white' }}>&#9881;</span> {/* Engrenagem */}
          <span className="sidebar-text-visible">Configurações</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;