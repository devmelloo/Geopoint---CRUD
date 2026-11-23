import Icon from './Icons.jsx';

export default function FiltroPontos({ valor, aoAlterar }) {
  return (
    <label className="search-wrap" htmlFor="filtro-pontos">
      <Icon name="search" size={19} />
      <input
        id="filtro-pontos"
        type="search"
        value={valor}
        onChange={(evento) => aoAlterar(evento.target.value)}
        placeholder="Pesquisar por nome ou descrição..."
        autoComplete="off"
      />
    </label>
  );
}
