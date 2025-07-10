// src/pages/Relatorios.jsx
import React, { useState, useEffect } from 'react';
import { getAgendamentos } from '../model/agendamentoModel';

const Relatorios = () => {
  const [dadosRelatorio, setDadosRelatorio] = useState({
    totalPorTipo: {},
    totalConfirmados: 0,
    totalFaltas: 0,
    totalAgendamentos: 0,
    taxaComparecimento: '0%',
  });

  useEffect(() => {
    const calcularRelatorios = () => {
      const agendamentos = getAgendamentos();
      const totalPorTipo = {};
      let totalConfirmados = 0;
      let totalFaltas = 0;
      let totalAgendamentos = agendamentos.length;

      agendamentos.forEach(ag => {
        // Total por Tipo de Consulta
        totalPorTipo[ag.tipoConsulta] = (totalPorTipo[ag.tipoConsulta] || 0) + 1;

        // Taxa de Comparecimento
        if (ag.status === 'Confirmado') {
          totalConfirmados++;
        } else if (ag.status === 'Faltou') {
          totalFaltas++;
        }
      });

      const taxaComparecimento = totalAgendamentos > 0 
        ? ((totalConfirmados / totalAgendamentos) * 100).toFixed(2) + '%'
        : '0%';

      setDadosRelatorio({
        totalPorTipo,
        totalConfirmados,
        totalFaltas,
        totalAgendamentos,
        taxaComparecimento,
      });
    };

    calcularRelatorios();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ color: 'var(--cor-primaria)', textAlign: 'center' }}>Relatórios de Gestão</h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        marginTop: '20px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          borderLeft: '5px solid var(--cor-primaria)'
        }}>
          <h2>Total de Agendamentos</h2>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0' }}>{dadosRelatorio.totalAgendamentos}</p>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          borderLeft: '5px solid var(--cor-sucesso)'
        }}>
          <h2>Taxa de Comparecimento</h2>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0' }}>{dadosRelatorio.taxaComparecimento}</p>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          borderLeft: '5px solid var(--cor-secundaria)'
        }}>
          <h2>Agendamentos por Tipo</h2>
          {
            Object.entries(dadosRelatorio.totalPorTipo).map(([tipo, total]) => (
              <p key={tipo} style={{ margin: '5px 0' }}>{tipo}: <strong>{total}</strong></p>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default Relatorios;
