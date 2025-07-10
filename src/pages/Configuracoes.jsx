// src/pages/Configuracoes.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getMensagemLembrete, saveMensagemLembrete } from '../model/configuracoesModel';

const Configuracoes = () => {
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    setMensagem(getMensagemLembrete());
  }, []);

  const handleChange = (e) => {
    setMensagem(e.target.value);
  };

  const handleSave = () => {
    saveMensagemLembrete(mensagem);
    toast.success('Mensagem de lembrete salva com sucesso!');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ color: 'var(--cor-primaria)', textAlign: 'center' }}>Configurações</h1>

      <div style={{
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
        <h2>Mensagem de Lembrete do WhatsApp</h2>
        <p style={{ fontSize: '0.9rem', color: '#666' }}>
          Use as variáveis <code>{'{nome_paciente}'}</code>, <code>{'{data}'}</code>, <code>{'{hora}'}</code> e <code>{'{local}'}</code>.
        </p>
        <textarea
          value={mensagem}
          onChange={handleChange}
          rows="8"
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid var(--cor-borda)', width: '100%', boxSizing: 'border-box' }}
        ></textarea>
        <button onClick={handleSave} style={{
          padding: '10px 20px',
          backgroundColor: 'var(--cor-primaria)',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '1rem'
        }}>
          Salvar Mensagem
        </button>
      </div>
    </div>
  );
};

export default Configuracoes;