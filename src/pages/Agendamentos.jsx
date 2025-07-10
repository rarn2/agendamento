// src/pages/Agendamentos.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAgendamentos, saveAgendamento, deleteAgendamento, getAgendamentoById } from '../model/agendamentoModel';
import { getPacientes } from '../model/pacienteModel';
import { getLocais } from '../model/localModel';
import { getMensagemLembrete } from '../model/configuracoesModel';

const TIPOS_CONSULTA = ['Consulta Inicial', 'Retorno', 'Reagendamento'];
const STATUS_AGENDAMENTO = ['Confirmado', 'Reagendado', 'Faltou', 'Pendente'];

const Agendamentos = () => {
  const [agendamentos, setAgendamentos] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [locais, setLocais] = useState([]);
  const [form, setForm] = useState({
    id: null,
    pacienteId: '',
    localId: '',
    dataHora: '',
    tipoConsulta: TIPOS_CONSULTA[0],
    status: STATUS_AGENDAMENTO[3],
  });
  const [searchTermPaciente, setSearchTermPaciente] = useState('');
  const [sugestoesPacientes, setSugestoesPacientes] = useState([]);
  const [pacienteSelecionadoNome, setPacienteSelecionadoNome] = useState('');

  const pacienteInputRef = useRef(null);
  const [searchParams] = useSearchParams();
  const filter = searchParams.get('filter');

  useEffect(() => {
    carregarDados();
  }, [filter]);

  useEffect(() => {
    if (searchTermPaciente.length > 0) {
      const filtered = pacientes.filter(p =>
        p.nome.toLowerCase().includes(searchTermPaciente.toLowerCase())
      );
      setSugestoesPacientes(filtered);
    } else {
      setSugestoesPacientes([]);
    }
  }, [searchTermPaciente, pacientes]);

  const carregarDados = () => {
    const todosAgendamentos = getAgendamentos().map(ag => getAgendamentoById(ag.id));
    setPacientes(getPacientes());
    setLocais(getLocais());

    let agendamentosFiltrados = todosAgendamentos;

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (filter === 'today') {
      agendamentosFiltrados = todosAgendamentos.filter(ag => {
        const dataAgendamento = new Date(ag.dataHora);
        dataAgendamento.setHours(0, 0, 0, 0);
        return dataAgendamento.getTime() === hoje.getTime();
      });
    } else if (filter === 'week') {
      const inicioSemana = new Date(hoje);
      inicioSemana.setDate(hoje.getDate() - hoje.getDay());
      inicioSemana.setHours(0, 0, 0, 0);

      agendamentosFiltrados = todosAgendamentos.filter(ag => {
        const dataAgendamento = new Date(ag.dataHora);
        dataAgendamento.setHours(0, 0, 0, 0);
        return dataAgendamento >= inicioSemana && dataAgendamento <= hoje;
      });
    } else if (filter === 'month') {
      const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
      inicioMes.setHours(0, 0, 0, 0);

      agendamentosFiltrados = todosAgendamentos.filter(ag => {
        const dataAgendamento = new Date(ag.dataHora);
        dataAgendamento.setHours(0, 0, 0, 0);
        return dataAgendamento >= inicioMes && dataAgendamento <= hoje;
      });
    }

    setAgendamentos(agendamentosFiltrados);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handlePacienteSearchChange = (e) => {
    setSearchTermPaciente(e.target.value);
    setForm({ ...form, pacienteId: '' });
    setPacienteSelecionadoNome('');
  };

  const handleSelectPaciente = (paciente) => {
    setForm({ ...form, pacienteId: paciente.id });
    setSearchTermPaciente(paciente.nome);
    setPacienteSelecionadoNome(paciente.nome);
    setSugestoesPacientes([]);
    pacienteInputRef.current.blur();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.pacienteId) {
      toast.error('Por favor, selecione um paciente da lista de sugestões.');
      return;
    }
    try {
      saveAgendamento(form);
      carregarDados();
      resetForm();
      toast.success(form.id ? 'Agendamento atualizado com sucesso!' : 'Agendamento adicionado com sucesso!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEdit = (agendamento) => {
    const data = new Date(agendamento.dataHora);
    const dataFormatada = data.toISOString().split('T')[0];
    const horaFormatada = data.toTimeString().split(' ')[0].substring(0, 5);

    setForm({
      id: agendamento.id,
      pacienteId: agendamento.paciente.id,
      localId: agendamento.local.id,
      dataHora: `${dataFormatada}T${horaFormatada}`,
      tipoConsulta: agendamento.tipoConsulta,
      status: agendamento.status,
    });
    setSearchTermPaciente(agendamento.paciente.nome);
    setPacienteSelecionadoNome(agendamento.paciente.nome);
    toast.info('Editando agendamento...');
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja deletar este agendamento?')) {
      deleteAgendamento(id);
      carregarDados();
      toast.success('Agendamento deletado com sucesso!');
    }
  };

  const handleConfirmPresence = (agendamento) => {
    const updatedAgendamento = { ...agendamento, status: 'Confirmado' };
    saveAgendamento(updatedAgendamento);
    carregarDados();
    toast.success(`Presença de ${agendamento.paciente.nome} confirmada!`);
  };

  const handleReschedule = (agendamento) => {
    // Atualiza o agendamento original para 'Reagendado'
    const updatedAgendamento = { ...agendamento, status: 'Reagendado' };
    saveAgendamento(updatedAgendamento);

    // Preenche o formulário para um novo agendamento
    setForm({
      id: null, // Novo agendamento
      pacienteId: agendamento.paciente.id,
      localId: agendamento.local.id,
      dataHora: '', // Limpa a data para nova seleção
      tipoConsulta: 'Reagendamento',
      status: 'Pendente', // Novo agendamento começa como Pendente
    });
    setSearchTermPaciente(agendamento.paciente.nome);
    setPacienteSelecionadoNome(agendamento.paciente.nome);
    setSugestoesPacientes([]);
    carregarDados(); // Recarrega para mostrar o status do agendamento original
    toast.info(`Agendamento de ${agendamento.paciente.nome} marcado para reagendamento. Preencha a nova data e hora.`);
  };

  const handleWhatsAppReminder = (agendamento) => {
    const mensagemTemplate = getMensagemLembrete();
    const data = new Date(agendamento.dataHora);
    const dataFormatada = data.toLocaleDateString('pt-BR');
    const horaFormatada = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    let localInfo = agendamento.local?.nome || 'Local Desconhecido';
    if (agendamento.local?.endereco) {
      localInfo += ` - ${agendamento.local.endereco}`;
    }
    if (agendamento.local?.linkMapa) {
      localInfo += ` (Link: ${agendamento.local.linkMapa})`;
    }

    let mensagemFinal = mensagemTemplate
      .replace(/{nome_paciente}/g, agendamento.paciente.nome)
      .replace(/{data}/g, dataFormatada)
      .replace(/{hora}/g, horaFormatada)
      .replace(/{local}/g, localInfo);

    const telefoneLimpo = agendamento.paciente.telefone.replace(/\D/g, '');
    const linkWhatsApp = `https://wa.me/55${telefoneLimpo}?text=${encodeURIComponent(mensagemFinal)}`;
    window.open(linkWhatsApp, '_blank');
    toast.info('Abrindo WhatsApp com lembrete...');
  };

  const resetForm = () => {
    setForm({
      id: null,
      pacienteId: '',
      localId: '',
      dataHora: '',
      tipoConsulta: TIPOS_CONSULTA[0],
      status: STATUS_AGENDAMENTO[3],
    });
    setSearchTermPaciente('');
    setPacienteSelecionadoNome('');
    setSugestoesPacientes([]);
  };

  const getCardBorderColor = (status) => {
    switch (status) {
      case 'Confirmado':
        return 'var(--cor-sucesso)';
      case 'Reagendado':
        return 'var(--cor-aviso)';
      case 'Faltou':
        return 'var(--cor-erro)';
      default:
        return 'gray'; // Cor padrão para Pendente ou outros
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Confirmado':
        return <span role="img" aria-label="confirmado" style={{ marginLeft: '5px' }}>✅</span>;
      case 'Reagendado':
        return <span role="img" aria-label="reagendado" style={{ marginLeft: '5px' }}>🔄</span>;
      case 'Faltou':
        return <span role="img" aria-label="faltou" style={{ marginLeft: '5px' }}>❌</span>;
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ color: 'var(--cor-primaria)', textAlign: 'center' }}>Gestão de Agendamentos</h1>

      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '600px',
        margin: '20px auto',
        padding: '20px',
        border: '1px solid var(--cor-borda)',
        borderRadius: '8px',
        backgroundColor: 'white'
      }}>
        <div style={{ position: 'relative' }}>
          <input
            ref={pacienteInputRef}
            type="text"
            name="pacienteSearch"
            placeholder="Buscar ou Selecionar Paciente"
            value={searchTermPaciente}
            onChange={handlePacienteSearchChange}
            required
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid var(--cor-borda)', width: '100%', boxSizing: 'border-box' }}
          />
          {sugestoesPacientes.length > 0 && searchTermPaciente.length > 0 && (
            <ul style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: 'white',
              border: '1px solid var(--cor-borda)',
              borderRadius: '4px',
              maxHeight: '200px',
              overflowY: 'auto',
              zIndex: 1000,
              listStyle: 'none',
              padding: 0,
              margin: 0,
            }}>
              {sugestoesPacientes.map(p => (
                <li
                  key={p.id}
                  onClick={() => handleSelectPaciente(p)}
                  style={{
                    padding: '10px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #eee',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <span style={{ width: '15px', height: '15px', borderRadius: '50%', backgroundColor: p.corAssociada }}></span>
                  {p.nome} ({p.telefone})
                </li>
              ))}
            </ul>
          )}
          {form.pacienteId && pacienteSelecionadoNome && (
            <p style={{ margin: '5px 0 0 0', fontSize: '0.85rem', color: 'var(--cor-primaria)' }}>
              Paciente Selecionado: <strong>{pacienteSelecionadoNome}</strong>
            </p>
          )}
        </div>

        <select
          name="localId"
          value={form.localId}
          onChange={handleChange}
          required
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid var(--cor-borda)' }}
        >
          <option value="">Selecione o Local</option>
          {locais.map(l => (
            <option key={l.id} value={l.id}>{l.nome}</option>
          ))}
        </select>

        <input
          type="datetime-local"
          name="dataHora"
          value={form.dataHora}
          onChange={handleChange}
          required
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid var(--cor-borda)' }}
        />

        <select
          name="tipoConsulta"
          value={form.tipoConsulta}
          onChange={handleChange}
          required
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid var(--cor-borda)' }}
        >
          {TIPOS_CONSULTA.map(tipo => (
            <option key={tipo} value={tipo}>{tipo}</option>
          ))}
        </select>

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          required
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid var(--cor-borda)' }}
        >
          {STATUS_AGENDAMENTO.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>

        <button type="submit" style={{
          padding: '10px 20px',
          backgroundColor: 'var(--cor-primaria)',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '1rem'
        }}>
          {form.id ? 'Atualizar Agendamento' : 'Adicionar Agendamento'}
        </button>
        {form.id && (
          <button type="button" onClick={resetForm} style={{
            padding: '10px 20px',
            backgroundColor: 'var(--cor-secundaria)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
            marginTop: '5px'
          }}>
            Cancelar Edição
          </button>
        )}
      </form>

      <div style={{
        marginTop: '30px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px'
      }}>
        {agendamentos.sort((a, b) => new Date(a.dataHora) - new Date(b.dataHora)).map(ag => (
          <div key={ag.id} style={{
            backgroundColor: 'white',
            padding: '15px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            borderLeft: `5px solid ${getCardBorderColor(ag.status)}`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <h3 style={{ margin: '0 0 5px 0', color: 'var(--cor-primaria)' }}>
                {ag.paciente?.nome || 'Paciente Desconhecido'} - {new Date(ag.dataHora).toLocaleDateString('pt-BR')} às {new Date(ag.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </h3>
              <p style={{ margin: '0', fontSize: '0.9rem', color: '#666' }}>Local: {ag.local?.nome || 'Local Desconhecido'}</p>
              <p style={{ margin: '0', fontSize: '0.9rem', color: '#666' }}>Tipo: {ag.tipoConsulta}</p>
              <p style={{ margin: '0', fontSize: '0.9rem', color: '#666' }}>Status: {ag.status} {getStatusIcon(ag.status)}</p>
            </div>
            <div style={{ marginTop: '15px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button onClick={() => handleEdit(ag)} style={{
                padding: '8px 12px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}>Editar</button>
              <button onClick={() => handleDelete(ag.id)} style={{
                padding: '8px 12px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}>Deletar</button>
              <button onClick={() => handleConfirmPresence(ag)} style={{
                padding: '8px 12px',
                backgroundColor: 'var(--cor-sucesso)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}>Confirmar Presença</button>
              <button onClick={() => handleReschedule(ag)} style={{
                padding: '8px 12px',
                backgroundColor: 'var(--cor-aviso)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}>Reagendar</button>
              <button onClick={() => handleWhatsAppReminder(ag)} style={{
                padding: '8px 12px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}>Lembrete WhatsApp</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Agendamentos;