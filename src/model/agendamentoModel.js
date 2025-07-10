// src/model/agendamentoModel.js
import { getPacienteById } from './pacienteModel';
import { getLocalById } from './localModel';

const AGENDAMENTOS_STORAGE_KEY = 'agendamento_agendamentos';

/**
 * Gera um ID único simples para novos registros.
 */
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

/**
 * Busca todos os agendamentos do localStorage.
 * @returns {Array} Lista de agendamentos.
 */
export const getAgendamentos = () => {
  const agendamentos = localStorage.getItem(AGENDAMENTOS_STORAGE_KEY);
  return agendamentos ? JSON.parse(agendamentos) : [];
};

/**
 * Salva um agendamento (novo ou existente) no localStorage.
 * @param {object} agendamentoData - O objeto do agendamento.
 * @returns {object} O agendamento salvo.
 * @throws {Error} Se a data do agendamento for no passado.
 */
export const saveAgendamento = (agendamentoData) => {
  const agora = new Date();
  const dataAgendamento = new Date(agendamentoData.dataHora);

  // Impede salvar agendamento no passado (exceto se for uma atualização)
  if (!agendamentoData.id && dataAgendamento < agora) {
    throw new Error('Não é possível criar agendamentos em datas passadas.');
  }

  let agendamentos = getAgendamentos();
  if (agendamentoData.id) {
    agendamentos = agendamentos.map(a => (a.id === agendamentoData.id ? agendamentoData : a));
  } else {
    agendamentoData.id = generateId();
    agendamentos.push(agendamentoData);
  }
  localStorage.setItem(AGENDAMENTOS_STORAGE_KEY, JSON.stringify(agendamentos));
  return agendamentoData;
};

/**
 * Busca um agendamento pelo seu ID, incluindo detalhes do paciente e local.
 * @param {string} id - O ID do agendamento.
 * @returns {object|undefined} O agendamento com dados populados.
 */
export const getAgendamentoById = (id) => {
    const agendamentos = getAgendamentos();
    const agendamento = agendamentos.find(a => a.id === id);
    if (!agendamento) return undefined;

    // Popula os dados do paciente e do local
    return {
        ...agendamento,
        paciente: getPacienteById(agendamento.pacienteId),
        local: getLocalById(agendamento.localId)
    };
}

/**
 * Deleta um agendamento.
 * @param {string} id - O ID do agendamento a ser deletado.
 */
export const deleteAgendamento = (id) => {
  let agendamentos = getAgendamentos();
  const novosAgendamentos = agendamentos.filter(a => a.id !== id);
  localStorage.setItem(AGENDAMENTOS_STORAGE_KEY, JSON.stringify(novosAgendamentos));
};
