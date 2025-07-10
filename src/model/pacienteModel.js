// src/model/pacienteModel.js

const PACIENTES_STORAGE_KEY = 'agendamento_pacientes';
const CORES_USADAS_STORAGE_KEY = 'agendamento_cores_usadas';

// Paleta de cores inspirada em verde musgo e tons calmos
export const CORES_PALETA = [
  '#556B2F', // Verde Musgo Escuro (cor-primaria)
  '#8FBC8F', // Verde Mar Claro (cor-secundaria)
  '#6B8E23', // OliveDrab
  '#9ACD32', // YellowGreen
  '#ADFF2F', // GreenYellow
  '#7CFC00', // LawnGreen
  '#32CD32', // LimeGreen
  '#228B22', // ForestGreen
  '#006400', // DarkGreen
  '#2E8B57', // SeaGreen
  '#3CB371', // MediumSeaGreen
  '#66CDAA', // MediumAquaMarine
  '#8FBC8F', // DarkSeaGreen
  '#BDB76B', // DarkKhaki
  '#DAA520', // Goldenrod
  '#CD853F', // Peru
  '#D2B48C', // Tan
  '#F5DEB3', // Wheat
  '#F0E68C', // Khaki
  '#E6E6FA', // Lavender (para contraste)
];

/**
 * Gera um ID único simples para novos registros.
 */
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

/**
 * Busca as cores usadas do localStorage.
 * @returns {Array} Lista de cores usadas.
 */
const getUsedColors = () => {
  const coresUsadas = localStorage.getItem(CORES_USADAS_STORAGE_KEY);
  return coresUsadas ? JSON.parse(coresUsadas) : [];
};

/**
 * Salva as cores usadas no localStorage.
 * @param {Array} cores - Lista de cores usadas.
 */
const saveUsedColors = (cores) => {
  localStorage.setItem(CORES_USADAS_STORAGE_KEY, JSON.stringify(cores));
};

/**
 * Atribui uma cor não utilizada a um novo paciente.
 * Se todas as cores da paleta forem usadas, ele começará a reutilizar a primeira.
 * @returns {string} A cor atribuída.
 */
const assignColor = () => {
  let coresUsadas = getUsedColors();
  const coresDisponiveis = CORES_PALETA.filter(color => !coresUsadas.includes(color));

  let corAtribuida;
  if (coresDisponiveis.length > 0) {
    corAtribuida = coresDisponiveis[0]; // Pega a primeira cor disponível
  } else {
    // Se todas as cores foram usadas, reutiliza a primeira da paleta
    corAtribuida = CORES_PALETA[0];
  }

  coresUsadas.push(corAtribuida);
  saveUsedColors(coresUsadas);
  return corAtribuida;
};

/**
 * Libera uma cor quando um paciente é deletado.
 * @param {string} color - A cor a ser liberada.
 */
const releaseColor = (color) => {
  let coresUsadas = getUsedColors();
  const index = coresUsadas.indexOf(color);
  if (index > -1) {
    coresUsadas.splice(index, 1);
    saveUsedColors(coresUsadas);
  }
};

/**
 * Busca todos os pacientes do localStorage.
 * @returns {Array} Lista de pacientes.
 */
export const getPacientes = () => {
  const pacientes = localStorage.getItem(PACIENTES_STORAGE_KEY);
  return pacientes ? JSON.parse(pacientes) : [];
};

/**
 * Salva um paciente (novo ou existente) no localStorage.
 * @param {object} pacienteData - O objeto do paciente a ser salvo.
 * @returns {object} O paciente salvo (com ID, se for novo).
 */
export const savePaciente = (pacienteData) => {
  let pacientes = getPacientes();
  if (pacienteData.id) {
    // Atualiza paciente existente
    pacientes = pacientes.map(p => (p.id === pacienteData.id ? pacienteData : p));
  } else {
    // Adiciona novo paciente com um ID e atribui uma cor
    pacienteData.id = generateId();
    pacienteData.corAssociada = assignColor(); // Atribui a cor aqui
    pacientes.push(pacienteData);
  }
  localStorage.setItem(PACIENTES_STORAGE_KEY, JSON.stringify(pacientes));
  return pacienteData;
};

/**
 * Busca um paciente pelo seu ID.
 * @param {string} id - O ID do paciente.
 * @returns {object|undefined} O paciente encontrado ou undefined.
 */
export const getPacienteById = (id) => {
    const pacientes = getPacientes();
    return pacientes.find(p => p.id === id);
}

/**
 * Deleta um paciente do localStorage pelo ID.
 * @param {string} id - O ID do paciente a ser deletado.
 */
export const deletePaciente = (id) => {
  let pacientes = getPacientes();
  const pacienteParaDeletar = pacientes.find(p => p.id === id);
  if (pacienteParaDeletar && pacienteParaDeletar.corAssociada) {
    releaseColor(pacienteParaDeletar.corAssociada);
  }
  const novosPacientes = pacientes.filter(p => p.id !== id);
  localStorage.setItem(PACIENTES_STORAGE_KEY, JSON.stringify(novosPacientes));
};
