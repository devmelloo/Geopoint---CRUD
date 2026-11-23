import { Link } from 'react-router-dom';
import Icon from './Icons.jsx';

export default function Botao({ children, para, icon, variante = 'primario', className = '', ...props }) {
  const classe = `btn btn-${variante} ${className}`;
  const conteudo = <>{icon && <Icon name={icon} size={17} />}{children}</>;

  if (para) return <Link to={para} className={classe}>{conteudo}</Link>;
  return <button className={classe} {...props}>{conteudo}</button>;
}
