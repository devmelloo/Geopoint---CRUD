import Icon from './Icons.jsx';

export default function Mensagem({ tipo = 'info', children, acao }) {
  return (
    <div className={`mensagem mensagem-${tipo}`} role={tipo === 'erro' ? 'alert' : 'status'}>
      <Icon name={tipo === 'erro' ? 'alert' : tipo === 'sucesso' ? 'check' : 'pin'} size={20} />
      <div>{children}</div>
      {acao}
    </div>
  );
}
