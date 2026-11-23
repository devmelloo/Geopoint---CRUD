export const pontoVazio = {
  name: '',
  description: '',
  latitude: '',
  longitude: '',
};

export function validarPonto(campos) {
  const erros = {};
  const nome = campos.name.trim();
  const descricao = campos.description.trim();

  if (!nome) erros.name = 'Informe o nome do ponto.';
  else if (nome.length > 100) erros.name = 'O nome pode ter no máximo 100 caracteres.';

  if (descricao.length > 255) erros.description = 'A descrição pode ter no máximo 255 caracteres.';

  if (campos.latitude === '' || String(campos.latitude).trim() === '') {
    erros.latitude = 'Informe a latitude.';
  } else if (!Number.isFinite(Number(campos.latitude)) || Number(campos.latitude) < -90 || Number(campos.latitude) > 90) {
    erros.latitude = 'A latitude deve estar entre -90 e 90.';
  }

  if (campos.longitude === '' || String(campos.longitude).trim() === '') {
    erros.longitude = 'Informe a longitude.';
  } else if (!Number.isFinite(Number(campos.longitude)) || Number(campos.longitude) < -180 || Number(campos.longitude) > 180) {
    erros.longitude = 'A longitude deve estar entre -180 e 180.';
  }

  return erros;
}

export function prepararPonto(campos) {
  return {
    name: campos.name.trim(),
    description: campos.description.trim(),
    latitude: Number(campos.latitude),
    longitude: Number(campos.longitude),
  };
}

export function formatarCoordenada(valor) {
  return typeof valor === 'number' && Number.isFinite(valor) ? valor.toFixed(6) : String(valor ?? '—');
}
