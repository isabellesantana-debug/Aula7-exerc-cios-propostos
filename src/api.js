// Adicione a classe no topo do arquivo src/api.js
export class ApiError extends Error {
  constructor(status, statusText) {
    super(`Erro HTTP ${status}: ${statusText}`);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
  }
}

// Atualize a função requisicao interna:
async function requisicao(url, opcoes = {}) {
  try {
    const resposta = await fetch(`${BASE_URL}${url}`, opcoes);
    
    if (!resposta.ok) {
      // Lança o erro com o status HTTP correto
      throw new ApiError(resposta.status, resposta.statusText);
    }

    if (resposta.status === 204) return null;
    return resposta.json();
  } catch (erro) {
    // Repassa erros do tipo ApiError e encapsula falhas de rede puras
    if (erro.name === 'ApiError') throw erro;
    throw erro; // Vai cair como TypeError se for erro de rede
  }
}
