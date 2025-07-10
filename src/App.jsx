// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Dashboard from './pages/Dashboard';
import Pacientes from './pages/Pacientes';
import Locais from './pages/Locais';
import Agendamentos from './pages/Agendamentos';
import Configuracoes from './pages/Configuracoes';
import Sidebar from './components/Sidebar';

// Componente de Layout básico
const Layout = ({ children, toggleSidebar }) => {
  return (
    <div>
      <nav style={{
        backgroundColor: 'var(--cor-primaria)',
        padding: '1rem',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}>
        <button
          onClick={toggleSidebar}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '2rem',
            cursor: 'pointer',
            marginRight: '15px',
          }}
        >
          ☰
        </button>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Agendamento</h1>
      </nav>
      <main style={{ padding: '1rem' }}>
        {children}
      </main>
    </div>
  );
};

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }
  }, [isSidebarOpen]);

  return (
    <Router>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Layout toggleSidebar={toggleSidebar}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pacientes" element={<Pacientes />} />
          <Route path="/locais" element={<Locais />} />
          <Route path="/agendamentos" element={<Agendamentos />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
        </Routes>
      </Layout>
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </Router>
  );
}

export default App;