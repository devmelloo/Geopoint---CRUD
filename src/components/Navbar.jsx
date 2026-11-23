import { Link, NavLink } from 'react-router-dom';
import Icon from './Icons.jsx';

export default function Navbar() {
  return (
    <header className="header">
      <div className="container header-inner">
        <Link className="brand" to="/pontos" aria-label="GeoPoint - página inicial">
          <span className="brand-icon"><Icon name="pin" size={23} /></span>
          <span className="brand-name">Geo<span>Point</span><small>PAINEL DE GERENCIAMENTO</small></span>
        </Link>
        <nav className="nav" aria-label="Navegação principal">
          <NavLink to="/pontos" end className={({ isActive }) => `nav-item ${isActive ? 'nav-active' : ''}`}>
            <Icon name="list" size={17} /> <span>Listar pontos</span>
          </NavLink>
          <NavLink to="/pontos/novo" className={({ isActive }) => `nav-item ${isActive ? 'nav-active' : ''}`}>
            <Icon name="plus" size={17} /> <span>Novo ponto</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
