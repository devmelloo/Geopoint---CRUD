import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Botao from '../components/Botao.jsx';
import Mensagem from '../components/Mensagem.jsx';
import { buscarPonto, excluirPonto } from '../services/api.js';
import { formatarCoordenada } from '../utils/validacao.js';

export default function DetalhePonto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ponto, setPonto] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [excluindo, setExcluindo] = useState(false);

  useEffect(() => {
    let ativo = true;
    setCarregando(true);
    setErro('');
    buscarPonto(id)
      .then((resultado) => { if (ativo) setPonto(resultado); })
      .catch((falha) => { if (ativo) setErro(falha.message); })
      .finally(() => { if (ativo) setCarregando(false); });
    return () => { ativo = false; };
  }, [id]);

  async function remover() {
    if (!window.confirm(`Deseja realmente excluir o ponto “${ponto.name}”?`)) return;
    setExcluindo(true);
    setErro('');
    try {
      await excluirPonto(id);
      navigate('/pontos');
    } catch (falha) {
      setErro(falha.message);
      setExcluindo(false);
    }
  }

  return (
    <>
      <div className="back-line"><Botao para="/pontos" variante="link" icon="arrow">Voltar para lista</Botao></div>
      <section className="page-hero hero-small">
        <div><div className="eyebrow">PONTOS GEOGRÁFICOS / DETALHES</div><h1>Detalhes do ponto</h1><p>Confira as informações do local selecionado.</p></div>
      </section>
      {carregando ? <div className="panel empty-state"><span className="loading-spinner"/><p>Carregando ponto...</p></div> : erro && !ponto ? (
        <section className="panel form-content"><Mensagem tipo="erro">{erro}</Mensagem><Botao para="/pontos" variante="secundario">Voltar à lista</Botao></section>
      ) : ponto ? (
        <section className="panel detail-panel">
          <div className="detail-header"><div className="detail-marker">⌖</div><div><div className="eyebrow">PONTO GEOGRÁFICO</div><h2>{ponto.name}</h2></div></div>
          {erro && <div className="form-content"><Mensagem tipo="erro">{erro}</Mensagem></div>}
          <div className="detail-grid">
            <div className="detail-item full-width"><div className="detail-label">Descrição</div><div className="detail-value">{ponto.description || 'Sem descrição'}</div></div>
            <div className="detail-item"><div className="detail-label">Latitude</div><div className="detail-value mono">{formatarCoordenada(ponto.latitude)}</div></div>
            <div className="detail-item"><div className="detail-label">Longitude</div><div className="detail-value mono">{formatarCoordenada(ponto.longitude)}</div></div>
            <div className="detail-item full-width"><div className="detail-label">ID do registro (UUID)</div><div className="detail-value mono small-mono">{ponto.id}</div></div>
          </div>
          <div className="detail-actions"><Botao para="/pontos" variante="secundario" icon="arrow">Voltar</Botao><div className="detail-buttons"><Botao para={`/pontos/${id}/editar`} variante="primario" icon="edit">Editar ponto</Botao><Botao type="button" variante="perigo" icon="trash" disabled={excluindo} onClick={remover}>{excluindo ? 'Excluindo...' : 'Excluir ponto'}</Botao></div></div>
        </section>
      ) : null}
    </>
  );
}
