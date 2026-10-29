export const BASE_URL = 'http://localhost:3000'; 


export class ApiError extends Error {
  constructor(status, statusText) {
    super(`Erro HTTP ${status}: ${statusText}`);
    this.status = status;
    this.statusText = statusText;
  }
}

export async function requisicao(endpoint, opcoes = {}) {
  const url = `${BASE_URL}${endpoint}`;
  
  const { headers: headersDaChamada, ...outrasOpcoes } = opcoes;

  const configuracao = {
    ...outrasOpcoes,
    headers: {
      ...headersDaChamada
    }
  };

  if (configuracao.body) {
    configuracao.headers['Content-Type'] = 'application/json';
  }

  let resposta;
  try {
    resposta = await fetch(url, configuracao);
  } catch (erro) {
    if (erro.name === 'AbortError') {
      throw erro;
    }
    throw new Error('Failed to fetch');
  }

  if (!resposta.ok) {
    throw new ApiError(resposta.status, resposta.statusText);
  }

  if (resposta.status === 204) {
    return null;
  }

  return await resposta.json();
}

export async function apiGet(endpoint, opcoes = {}) {
  return requisicao(endpoint, { ...opcoes, method: 'GET' });
}

export async function apiPost(endpoint, dados, opcoes = {}) {
  return requisicao(endpoint, {
    ...opcoes,
    method: 'POST',
    body: JSON.stringify(dados) 
  });
}

export async function apiPut(endpoint, dados, opcoes = {}) {
  return requisicao(endpoint, {
    ...opcoes,
    method: 'PUT',
    body: JSON.stringify(dados)
  });
}

export async function apiDelete(endpoint, opcoes = {}) {
  return requisicao(endpoint, { ...opcoes, method: 'DELETE' });
}
