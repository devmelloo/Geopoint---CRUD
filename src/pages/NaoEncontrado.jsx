import Botao from '../components/Botao.jsx';

export default function NaoEncontrado() {
  return (
    <section className="panel empty-state not-found">
      <span className="error-404">404</span>
      <h1>Página não encontrada</h1>
      <p>Não encontramos o endereço que você tentou acessar.</p>
      <Botao para="/pontos" icon="arrow">Voltar para pontos</Botao>
    </section>
  );
}
