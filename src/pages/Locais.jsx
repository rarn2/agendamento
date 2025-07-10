// src/pages/Locais.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getLocais, saveLocal, deleteLocal } from '../model/localModel';

const Locais = () => {
  const [locais, setLocais] = useState([]);
  const [form, setForm] = useState({
    id: null,
    nome: '',
    endereco: '',
    linkMapa: '',
  });

  useEffect(() => {
    carregarLocais();
  }, []);

  const carregarLocais = () => {
    setLocais(getLocais());
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveLocal(form);
    carregarLocais();
    resetForm();
    toast.success(form.id ? 'Local atualizado com sucesso!' : 'Local adicionado com sucesso!');
  };

  const handleEdit = (local) => {
    setForm({ ...local });
    toast.info('Editando local...');
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja deletar este local?')) {
      deleteLocal(id);
      carregarLocais();
      toast.success('Local deletado com sucesso!');
    }
  };

  const resetForm = () => {
    setForm({
      id: null,
      nome: '',
      endereco: '',
      linkMapa: '',
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ color: 'var(--cor-primaria)', textAlign: 'center' }}>Gestão de Locais</h1>

      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '500px',
        margin: '20px auto',
        padding: '20px',
        border: '1px solid var(--cor-borda)',
        borderRadius: '8px',
        backgroundColor: 'white'
      }}>
        <input
          type="text"
          name="nome"
          placeholder="Nome do Local (Ex: Consultório Principal)"
          value={form.nome}
          onChange={handleChange}
          required
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid var(--cor-borda)' }}
        />
        <input
          type="text"
          name="endereco"
          placeholder="Endereço (Ex: Rua Exemplo, 123 - Cidade)"
          value={form.endereco}
          onChange={handleChange}
          required
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid var(--cor-borda)' }}
        />
        <input
          type="url"
          name="linkMapa"
          placeholder="Link do Mapa (Ex: https://maps.app.goo.gl/...)"
          value={form.linkMapa}
          onChange={handleChange}
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid var(--cor-borda)' }}
        />
        <button type="submit" style={{
          padding: '10px 20px',
          backgroundColor: 'var(--cor-primaria)',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '1rem'
        }}>
          {form.id ? 'Atualizar Local' : 'Adicionar Local'}
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
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px'
      }}>
        {locais.map(local => (
          <div key={local.id} style={{
            backgroundColor: 'white',
            padding: '15px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            borderLeft: `5px solid var(--cor-secundaria)`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <h3 style={{ margin: '0 0 5px 0', color: 'var(--cor-primaria)' }}>{local.nome}</h3>
              <p style={{ margin: '0', fontSize: '0.9rem', color: '#666' }}>{local.endereco}</p>
              {local.linkMapa && <a href={local.linkMapa} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.85rem', color: '#007bff', textDecoration: 'none' }}>Ver no Mapa</a>}
            </div>
            <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
              <button onClick={() => handleEdit(local)} style={{
                padding: '8px 12px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}>Editar</button>
              <button onClick={() => handleDelete(local.id)} style={{
                padding: '8px 12px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}>Deletar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Locais;