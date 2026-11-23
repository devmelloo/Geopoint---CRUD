import { Link } from 'react-router-dom';
import Icon from './Icons.jsx';
import { formatarCoordenada } from '../utils/validacao.js';

export default function TabelaPontos({ pontos, aoExcluir, excluindoId }) {
  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th scope="col">Nome</th>
            <th scope="col">Descrição</th>
            <th scope="col">Latitude</th>
            <th scope="col">Longitude</th>
            <th scope="col" className="col-acoes">Ações</th>
          </tr>
        </thead>
        <tbody>
          {pontos.map((ponto) => (
            <tr key={ponto.id}>
              <td><Link className="table-name" to={`/pontos/${ponto.id}`}>{ponto.name}</Link></td>
              <td className="description-cell">{ponto.description || '—'}</td>
              <td className="coordinate">{formatarCoordenada(ponto.latitude)}</td>
              <td className="coordinate">{formatarCoordenada(ponto.longitude)}</td>
              <td>
                <div className="table-actions">
                  <Link className="icon-button" to={`/pontos/${ponto.id}`} aria-label={`Ver ${ponto.name}`} title="Ver detalhes"><Icon name="eye" size={18} /></Link>
                  <Link className="icon-button" to={`/pontos/${ponto.id}/editar`} aria-label={`Editar ${ponto.name}`} title="Editar"><Icon name="edit" size={18} /></Link>
                  <button type="button" className="icon-button icon-danger" onClick={() => aoExcluir(ponto)} disabled={excluindoId !== null} aria-label={`Excluir ${ponto.name}`} title="Excluir"><Icon name="trash" size={18} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
