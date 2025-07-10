// src/pages/Pacientes.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getPacientes, savePaciente, deletePaciente } from '../model/pacienteModel';

const Pacientes = () => {
  const [pacientes, setPacientes] = useState([]);
  const [form, setForm] = useState({
    id: null,
    nome: '',
    telefone: '',
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    carregarPacientes();
  }, []);

  const carregarPacientes = () => {
    setPacientes(getPacientes());
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'telefone') {
      setForm({ ...form, [name]: formatarTelefone(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const formatarTelefone = (valor) => {
    valor = valor.replace(/\D/g, ''); // Remove tudo que não é dígito
    if (valor.length > 11) valor = valor.substring(0, 11);

    if (valor.length > 10) {
      // (00) 00000-0000
      return `(${valor.substring(0, 2)}) ${valor.substring(2, 7)}-${valor.substring(7, 11)}`;
    } else if (valor.length > 6) {
      // (00) 0000-0000
      return `(${valor.substring(0, 2)}) ${valor.substring(2, 6)}-${valor.substring(6, 10)}`;
    } else if (valor.length > 2) {
      // (00) 0000
      return `(${valor.substring(0, 2)}) ${valor.substring(2, valor.length)}`;
    } else if (valor.length > 0) {
      // (00
      return `(${valor}`; 
    }
    return valor;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    savePaciente(form);
    carregarPacientes();
    resetForm();
    toast.success(form.id ? 'Paciente atualizado com sucesso!' : 'Paciente adicionado com sucesso!');
  };

  const handleEdit = (paciente) => {
    setForm({ ...paciente });
    toast.info('Editando paciente...');
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja deletar este paciente?')) {
      deletePaciente(id);
      carregarPacientes();
      toast.success('Paciente deletado com sucesso!');
    }
  };

  const resetForm = () => {
    setForm({
      id: null,
      nome: '',
      telefone: '',
    });
  };

  const filteredPacientes = pacientes.filter(paciente =>
    paciente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paciente.telefone.replace(/\D/g, '').includes(searchTerm.replace(/\D/g, ''))
  );

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ color: 'var(--cor-primaria)', textAlign: 'center' }}>Gestão de Pacientes</h1>

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
          placeholder="Nome do Paciente"
          value={form.nome}
          onChange={handleChange}
          required
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid var(--cor-borda)' }}
        />
        <input
          type="text"
          name="telefone"
          placeholder="Telefone (00) 00000-0000"
          value={form.telefone}
          onChange={handleChange}
          maxLength="15" // (XX) XXXXX-XXXX
          required
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
          {form.id ? 'Atualizar Paciente' : 'Adicionar Paciente'}
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

      <input
        type="text"
        placeholder="Buscar paciente por nome ou telefone..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          padding: '10px',
          borderRadius: '4px',
          border: '1px solid var(--cor-borda)',
          width: 'calc(100% - 40px)',
          maxWidth: '500px',
          margin: '20px auto 0 auto',
          display: 'block'
        }}
      />

      <div style={{
        marginTop: '30px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px'
      }}>
        {filteredPacientes.map(paciente => (
          <div key={paciente.id} style={{
            backgroundColor: 'white',
            padding: '15px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            borderLeft: `5px solid ${paciente.corAssociada}`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <h3 style={{ margin: '0 0 5px 0', color: 'var(--cor-primaria)' }}>{paciente.nome}</h3>
              <p style={{ margin: '0', fontSize: '0.9rem', color: '#666' }}>{paciente.telefone}</p>
            </div>
            <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
              <button onClick={() => handleEdit(paciente)} style={{
                padding: '8px 12px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}>Editar</button>
              <button onClick={() => handleDelete(paciente.id)} style={{
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

export default Pacientes;