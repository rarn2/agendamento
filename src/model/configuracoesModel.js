// src/model/configuracoesModel.js

const CONFIG_STORAGE_KEY = 'agendamento_configuracoes';

const MENSAGEM_LEMBRETE_DEFAULT = 'Olá, {nome_paciente}! Este é um lembrete do seu agendamento para o dia {data} às {hora} no local: {local}. Até breve!';

/**
 * Salva a mensagem de lembrete no localStorage.
 * @param {string} textoMensagem - O texto da mensagem.
 */
export const saveMensagemLembrete = (textoMensagem) => {
  const config = { mensagemLembrete: textoMensagem };
  localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
};

/**
 * Busca a mensagem de lembrete do localStorage.
 * @returns {string} A mensagem de lembrete salva ou a padrão.
 */
export const getMensagemLembrete = () => {
  const config = localStorage.getItem(CONFIG_STORAGE_KEY);
  if (config) {
    return JSON.parse(config).mensagemLembrete;
  }
  return MENSAGEM_LEMBRETE_DEFAULT;
};
