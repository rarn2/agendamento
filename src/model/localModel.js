// src/model/localModel.js

const LOCAIS_STORAGE_KEY = 'agendamento_locais';

/**
 * Gera um ID único simples para novos registros.
 */
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

/**
 * Busca todos os locais do localStorage.
 * @returns {Array} Lista de locais.
 */
export const getLocais = () => {
  const locais = localStorage.getItem(LOCAIS_STORAGE_KEY);
  return locais ? JSON.parse(locais) : [];
};

/**
 * Salva um local (novo ou existente) no localStorage.
 * @param {object} localData - O objeto do local a ser salvo.
 * @returns {object} O local salvo (com ID, se for novo).
 */
export const saveLocal = (localData) => {
  let locais = getLocais();
  if (localData.id) {
    // Atualiza local existente
    locais = locais.map(l => (l.id === localData.id ? localData : l));
  } else {
    // Adiciona novo local com um ID
    localData.id = generateId();
    locais.push(localData);
  }
  localStorage.setItem(LOCAIS_STORAGE_KEY, JSON.stringify(locais));
  return localData;
};

/**
 * Busca um local pelo seu ID.
 * @param {string} id - O ID do local.
 * @returns {object|undefined} O local encontrado ou undefined.
 */
export const getLocalById = (id) => {
    const locais = getLocais();
    return locais.find(l => l.id === id);
}

/**
 * Deleta um local do localStorage pelo ID.
 * @param {string} id - O ID do local a ser deletado.
 */
export const deleteLocal = (id) => {
  let locais = getLocais();
  const novosLocais = locais.filter(l => l.id !== id);
  localStorage.setItem(LOCAIS_STORAGE_KEY, JSON.stringify(novosLocais));
};
