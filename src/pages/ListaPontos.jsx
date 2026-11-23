import { useEffect, useMemo, useState } from 'react';
import Botao from '../components/Botao.jsx';
import FiltroPontos from '../components/FiltroPontos.jsx';
import TabelaPontos from '../components/TabelaPontos.jsx';
import Mensagem from '../components/Mensagem.jsx';
import { excluirPonto, listarPontos } from '../services/api.js';

export default function ListaPontos() {
  const [pontos, setPontos] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [excluindoId, setExcluindoId] = useState(null);
  const [notificacao, setNotificacao] = useState('');
  const [versao, setVersao] = useState(0);

  useEffect(() => {
    let ativo = true;
    listarPontos()
      .then((dados) => {
        if (ativo) {
          if (!Array.isArray(dados)) throw new Error('A API não retornou uma lista válida.');
          setPontos(dados);
          setErro('');
        }
      })
      .catch((falha) => { if (ativo) setErro(falha.message); })
      .finally(() => { if (ativo) setCarregando(false); });
    return () => { ativo = false; };
  }, [versao]);

  const pontosFiltrados = useMemo(() => {
    const busca = filtro.trim().toLocaleLowerCase('pt-BR');
    return pontos.filter((ponto) =>
      String(ponto.name ?? '').toLocaleLowerCase('pt-BR').includes(busca) ||
      String(ponto.description ?? '').toLocaleLowerCase('pt-BR').includes(busca),
    );
  }, [pontos, filtro]);

  async function removerPonto(ponto) {
    if (!window.confirm(`Deseja realmente excluir o ponto “${ponto.name}”?`)) return;
    setExcluindoId(ponto.id);
    setErro('');
    setNotificacao('');
    try {
      await excluirPonto(ponto.id);
      setPontos((anteriores) => anteriores.filter((item) => item.id !== ponto.id));
      setNotificacao(`O ponto “${ponto.name}” foi excluído com sucesso.`);
    } catch (falha) {
      setErro(falha.message);
    } finally {
      setExcluindoId(null);
    }
  }

  function recarregar() {
    setCarregando(true);
    setErro('');
    setVersao((valor) => valor + 1);
  }

  return (
    <>
      <section className="page-hero">
        <div>
          <div className="eyebrow">VISÃO GERAL / PONTOS GEOGRÁFICOS</div>
          <h1>Gerenciar pontos</h1>
          <p>Visualize, organize e gerencie seus pontos geográficos em um só lugar.</p>
        </div>
        <Botao para="/pontos/novo" icon="plus">Novo ponto</Botao>
      </section>

      <section className="summary-strip" aria-label="Resumo dos registros">
        <div className="summary-icon">◎</div>
        <div><span className="summary-label">PONTOS CADASTRADOS</span><strong>{carregando ? '…' : pontos.length}</strong></div>
        <span className="summary-subtitle">Registros disponíveis na GeoPoint API</span>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div><h2>Lista de pontos</h2><p>Pesquise ou selecione um ponto para gerenciar.</p></div>
          <div className="counter">{pontosFiltrados.length} {pontosFiltrados.length === 1 ? 'resultado' : 'resultados'}</div>
        </div>
        <div className="panel-filter"><FiltroPontos valor={filtro} aoAlterar={setFiltro} /></div>
        <div className="panel-body">
          {notificacao && <Mensagem tipo="sucesso">{notificacao}</Mensagem>}
          {erro && <Mensagem tipo="erro">{erro} <button className="text-button" type="button" onClick={recarregar}>Tentar novamente</button></Mensagem>}
          {carregando ? (
            <div className="empty-state"><span className="loading-spinner" /> <p>Carregando pontos...</p></div>
          ) : !erro && pontosFiltrados.length === 0 ? (
            <div className="empty-state"><div className="empty-symbol">⌖</div><h3>Nenhum ponto encontrado</h3><p>{filtro ? 'Tente pesquisar com outro nome ou descrição.' : 'Cadastre seu primeiro ponto para começar.'}</p>{!filtro && <Botao para="/pontos/novo" icon="plus">Cadastrar ponto</Botao>}</div>
          ) : !erro ? (
            <TabelaPontos pontos={pontosFiltrados} aoExcluir={removerPonto} excluindoId={excluindoId} />
          ) : null}
        </div>
      </section>
    </>
  );
}
