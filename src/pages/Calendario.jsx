// src/pages/Calendario.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import ptBR from 'date-fns/locale/pt-BR';
import { getAgendamentos, getAgendamentoById } from '../model/agendamentoModel';
import { useNavigate } from 'react-router-dom';

import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'pt-BR': ptBR,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const Calendario = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const carregarEventos = () => {
      const agendamentos = getAgendamentos().map(ag => getAgendamentoById(ag.id));
      const eventosFormatados = agendamentos.map(ag => ({
        id: ag.id,
        title: `${ag.paciente?.nome || 'Paciente Desconhecido'} - ${ag.tipoConsulta}`,
        start: new Date(ag.dataHora),
        end: new Date(ag.dataHora), // Para agendamentos de ponto único
        allDay: false,
        resource: ag, // Armazena o objeto agendamento completo
      }));
      setEvents(eventosFormatados);
    };
    carregarEventos();
  }, []);

  const handleSelectEvent = (event) => {
    // Ao clicar em um evento, redireciona para a página de agendamentos para edição
    // Poderíamos passar o ID do agendamento para a página de agendamentos para pré-preencher o formulário
    navigate(`/agendamentos?edit=${event.id}`);
  };

  const eventPropGetter = useMemo(() => (event, start, end, isSelected) => {
    let newStyle = {
      backgroundColor: event.resource.paciente?.corAssociada || 'var(--cor-secundaria)',
      color: 'white',
      borderRadius: '0px',
      border: 'none',
    };

    switch (event.resource.status) {
      case 'Confirmado':
        newStyle.backgroundColor = 'var(--cor-sucesso)';
        break;
      case 'Reagendado':
        newStyle.backgroundColor = 'var(--cor-aviso)';
        break;
      case 'Faltou':
        newStyle.backgroundColor = 'var(--cor-erro)';
        break;
      default:
        // Usa a cor do paciente ou a cor secundária padrão
        break;
    }

    return {
      className: "",
      style: newStyle
    };
  }, []);

  return (
    <div style={{ padding: '20px', height: 'calc(100vh - 100px)' }}>
      <h1 style={{ color: 'var(--cor-primaria)', textAlign: 'center' }}>Calendário de Agendamentos</h1>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        messages={{
          next: 'Próximo',
          previous: 'Anterior',
          today: 'Hoje',
          month: 'Mês',
          week: 'Semana',
          day: 'Dia',
          agenda: 'Agenda',
          date: 'Data',
          time: 'Hora',
          event: 'Evento',
          noEventsInRange: 'Nenhum agendamento neste período.',
        }}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={eventPropGetter}
      />
    </div>
  );
};

export default Calendario;
