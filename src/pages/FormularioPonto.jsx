import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FormPonto from '../components/FormPonto.jsx';
import Botao from '../components/Botao.jsx';
import Mensagem from '../components/Mensagem.jsx';
import { atualizarPonto, buscarPonto, criarPonto } from '../services/api.js';
import { pontoVazio, prepararPonto, validarPonto } from '../utils/validacao.js';

export default function FormularioPonto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editando = Boolean(id);
  const [valores, setValores] = useState({ ...pontoVazio });
  const [erros, setErros] = useState({});
  const [erroApi, setErroApi] = useState('');
  const [carregando, setCarregando] = useState(editando);
  const [carregado, setCarregado] = useState(!editando);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!id) {
      setValores({ ...pontoVazio });
      setErros({});
      setErroApi('');
      setCarregando(false);
      setCarregado(true);
      return;
    }
    let ativo = true;
    setCarregando(true);
    setCarregado(false);
    setErroApi('');
    buscarPonto(id)
      .then((ponto) => {
        if (ativo) {
          setCarregado(true);
          setValores({
            name: ponto.name ?? '',
            description: ponto.description ?? '',
            latitude: String(ponto.latitude ?? ''),
            longitude: String(ponto.longitude ?? ''),
          });
        }
      })
      .catch((falha) => { if (ativo) setErroApi(falha.message); })
      .finally(() => { if (ativo) setCarregando(false); });
    return () => { ativo = false; };
  }, [id]);

  function alterarCampo(nome, valor) {
    setValores((anteriores) => ({ ...anteriores, [nome]: valor }));
    setErros((anteriores) => ({ ...anteriores, [nome]: '' }));
    setErroApi('');
  }

  async function enviar(evento) {
    evento.preventDefault();
    if (salvando) return;
    const validacoes = validarPonto(valores);
    setErros(validacoes);
    if (Object.keys(validacoes).length > 0) return;

    setSalvando(true);
    setErroApi('');
    try {
      const dados = prepararPonto(valores);
      if (editando) await atualizarPonto(id, dados);
      else await criarPonto(dados);
      navigate('/pontos');
    } catch (falha) {
      // Mensagens de validação enviadas por GlobalExceptionHandler (Spring Boot).
      if (falha.detalhes && Object.keys(falha.detalhes).length > 0) {
        setErros(falha.detalhes);
      }
      setErroApi(falha.message);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <>
      <div className="back-line"><Botao para="/pontos" variante="link" icon="arrow">Voltar para lista</Botao></div>
      <section className="page-hero hero-small">
        <div>
          <div className="eyebrow">PONTOS GEOGRÁFICOS / {editando ? 'EDITAR' : 'NOVO'}</div>
          <h1>{editando ? 'Editar ponto' : 'Cadastrar ponto'}</h1>
          <p>{editando ? 'Atualize as informações do ponto geográfico.' : 'Preencha os dados abaixo para adicionar um novo local.'}</p>
        </div>
      </section>
      <section className="panel form-panel">
        {carregando ? <div className="empty-state"><span className="loading-spinner"/><p>Carregando dados do ponto...</p></div> : (
          <div className="form-content">
            {erroApi && <Mensagem tipo="erro">{erroApi}</Mensagem>}
            {carregado && <FormPonto valores={valores} erros={erros} aoAlterar={alterarCampo} aoEnviar={enviar} salvando={salvando} editando={editando} />}
            {editando && !carregado && <Botao para="/pontos" variante="secundario">Voltar à lista</Botao>}
          </div>
        )}
      </section>
    </>
  );
}
