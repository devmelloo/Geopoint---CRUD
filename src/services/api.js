// Integração com o backend Java Spring Boot fornecido para o projeto.
// VITE_API_URL informa a origem, sem /api/points.
const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/+$/, '');
const ENDPOINT = `${API_URL}/api/points`;

export class ErroApi extends Error {
  constructor(mensagem, status, detalhes = {}) {
    super(mensagem);
    this.name = 'ErroApi';
    this.status = status;
    this.detalhes = detalhes;
  }
}

async function requisicao(caminho = '', opcoes = {}) {
  let resposta;
  try {
    resposta = await fetch(`${ENDPOINT}${caminho}`, {
      ...opcoes,
      headers: {
        Accept: 'application/json',
        ...(opcoes.body != null ? { 'Content-Type': 'application/json' } : {}),
        ...opcoes.headers,
      },
    });
  } catch {
    throw new ErroApi('Não foi possível conectar à GeoPoint API. Inicie o backend Java e o PostgreSQL e confira a URL no .env.', 0);
  }

  // O Spring Boot retorna uma mensagem e, em erros de validação,
  // um objeto details com mensagens por campo (name, latitude, longitude...).
  if (!resposta.ok) {
    const corpo = await resposta.json().catch(() => null);
    const detalhes = corpo?.details && typeof corpo.details === 'object' ? corpo.details : {};
    const mensagem = corpo?.message || corpo?.error || `Erro HTTP ${resposta.status}.`;
    if (resposta.status === 404) {
      throw new ErroApi('Ponto não encontrado. Ele pode ter sido excluído.', 404, detalhes);
    }
    throw new ErroApi(mensagem, resposta.status, detalhes);
  }

  // DELETE 204 No Content não possui JSON.
  if (resposta.status === 204) return null;
  const corpo = await resposta.text();
  return corpo ? JSON.parse(corpo) : null;
}

export const listarPontos = () => requisicao();
export const buscarPonto = (id) => requisicao(`/${encodeURIComponent(id)}`);
export const criarPonto = (ponto) => requisicao('', { method: 'POST', body: JSON.stringify(ponto) });
export const atualizarPonto = (id, ponto) => requisicao(`/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(ponto) });
export const excluirPonto = (id) => requisicao(`/${encodeURIComponent(id)}`, { method: 'DELETE' });
