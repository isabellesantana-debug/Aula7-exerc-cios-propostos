import React, { useState, useEffect } from 'react';
import { apiGet, apiPost, apiPut, apiDelete, ApiError } from './api';

export function ComponenteUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [nome, setNome] = useState('');
  const [idEdicao, setIdEdicao] = useState(null);
  
  const [mensagemErro, setMensagemErro] = useState('');

  useEffect(() => {
    const controlador = new AbortController();

    async function carregarUsuarios() {
      try {
        setMensagemErro(''); 
        
        const dados = await apiGet('/users', { signal: controlador.signal });
        setUsuarios(dados);
      } catch (erro) {
        if (erro.name === 'AbortError') return;

        if (erro instanceof ApiError) {
          if (erro.status === 404) {
            setMensagemErro("Recurso não encontrado");
          } else if (erro.status === 500) {
            setMensagemErro("Erro no servidor");
          } else {
            setMensagemErro(`Erro desconhecido: ${erro.status}`);
          }
        } else if (erro.message === 'Failed to fetch') {
          setMensagemErro("Falha de rede");
        }
      }
    }

    carregarUsuarios();

    return () => {
      controlador.abort();
    };
  }, []);

  async function lidarComEnvio(evento) {
    evento.preventDefault();
    if (!nome.trim()) return;

    try {
      if (idEdicao) {
        await apiPut(`/users/${idEdicao}`, { name: nome });
        setIdEdicao(null);
      } else {
        await apiPost('/users', { name: nome }, { headers: { 'X-Custom': 'aula07' } });
      }

      setNome('');
      const dados Atualizados = await apiGet('/users');
      setUsuarios(dadosAtualizados);
    } catch (erro) {
      alert('Não foi possível salvar os dados.');
    }
  }

  async function deletarUsuario(id) {
    try {
      await apiDelete(`/users/${id}`);
      setUsuarios(usuarios.filter(u => u.id !== id));
    } catch (erro) {
      alert('Não foi possível deletar o usuário.');
    }
  }

  function prepararEdicao(usuario) {
    setIdEdicao(usuario.id);
    setNome(usuario.name);
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Gerenciamento de Usuários (Aula 07)</h2>

     
      {mensagemErro && (
        <div style={{ color: 'red', background: '#fee', padding: '10px', marginBottom: '15px', borderRadius: '4px' }}>
           {mensagemErro}
        </div>
      )}

   
      <form onSubmit={lidarComEnvio} style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Nome do usuário" 
          value={nome} 
          onChange={(e) => setNome(e.target.value)} 
          style={{ padding: '5px', marginRight: '10px' }}
        />
        <button type="submit" style={{ padding: '5px 10px' }}>
          {idEdicao ? 'Salvar Alteração' : 'Adicionar Usuário'}
        </button>
        {idEdicao && (
          <button type="button" onClick={() => { setIdEdicao(null); setNome(''); }} style={{ marginLeft: '5px' }}>
            Cancelar
          </button>
        )}
      </form>

   
      <ul>
        {usuarios.map((usuario) => (
          <li key={usuario.id} style={{ marginBottom: '10px' }}>
            {usuario.name} {' '}
            <button onClick={() => prepararEdicao(usuario)} style={{ marginLeft: '10px' }}>Editar</button>
            <button onClick={() => deletarUsuario(usuario.id)} style={{ marginLeft: '5px', color: 'red' }}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
