// src/controller/useDashboardData.js
import { useState, useEffect } from 'react';
import { getAgendamentos } from '../model/agendamentoModel';

const useDashboardData = () => {
  const [totais, setTotais] = useState({
    dia: 0,
    semana: 0,
    mes: 0,
  });

  useEffect(() => {
    const calcularTotais = () => {
      const agendamentos = getAgendamentos();
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0); // Zera a hora para comparação

      const inicioSemana = new Date(hoje);
      inicioSemana.setDate(hoje.getDate() - hoje.getDay()); // Domingo da semana atual

      const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

      let totalDia = 0;
      let totalSemana = 0;
      let totalMes = 0;

      agendamentos.forEach(agendamento => {
        const dataAgendamento = new Date(agendamento.dataHora);
        dataAgendamento.setHours(0, 0, 0, 0);

        // Total do Dia
        if (dataAgendamento.getTime() === hoje.getTime()) {
          totalDia++;
        }

        // Total da Semana
        if (dataAgendamento >= inicioSemana && dataAgendamento <= hoje) {
          totalSemana++;
        }

        // Total do Mês
        if (dataAgendamento >= inicioMes && dataAgendamento <= hoje) {
          totalMes++;
        }
      });

      setTotais({
        dia: totalDia,
        semana: totalSemana,
        mes: totalMes,
      });
    };

    calcularTotais();

    // Opcional: Recalcular totais se houver alguma mudança nos agendamentos (ex: via evento)
    // Por simplicidade, para este MVP, vamos recalcular apenas no carregamento.
    // Em uma aplicação maior, poderíamos usar um Context API ou um sistema de eventos.

  }, []); // Executa apenas uma vez no montagem do componente

  return totais;
};

export default useDashboardData;
