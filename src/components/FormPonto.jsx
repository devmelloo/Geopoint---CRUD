import CampoTexto from './CampoTexto.jsx';
import Botao from './Botao.jsx';

export default function FormPonto({ valores, erros, aoAlterar, aoEnviar, salvando, editando }) {
  function alterar(evento) {
    const { name, value } = evento.target;
    aoAlterar(name, value);
  }

  return (
    <form onSubmit={aoEnviar} noValidate>
      <div className="form-section-title">Informações do ponto</div>
      <div className="form-grid">
        <div className="full-width">
          <CampoTexto id="name" name="name" titulo="Nome do ponto" placeholder="Ex.: Praça Central" value={valores.name} onChange={alterar} required maxLength={101} erro={erros.name} dica={`${valores.name.length}/100 caracteres`} />
        </div>
        <div className="full-width">
          <CampoTexto id="description" name="description" titulo="Descrição" placeholder="Descreva este local..." value={valores.description} onChange={alterar} multiline rows={4} maxLength={256} erro={erros.description} dica="Opcional · até 255 caracteres" />
        </div>
        <CampoTexto id="latitude" name="latitude" titulo="Latitude" type="number" step="any" min="-90" max="90" placeholder="Ex.: -28.2825" value={valores.latitude} onChange={alterar} required erro={erros.latitude} dica="Entre -90 e 90" />
        <CampoTexto id="longitude" name="longitude" titulo="Longitude" type="number" step="any" min="-180" max="180" placeholder="Ex.: -52.7869" value={valores.longitude} onChange={alterar} required erro={erros.longitude} dica="Entre -180 e 180" />
      </div>
      <div className="form-actions">
        <Botao para="/pontos" variante="secundario">Cancelar</Botao>
        <Botao type="submit" icon="check" disabled={salvando}>{salvando ? 'Salvando...' : editando ? 'Salvar alterações' : 'Cadastrar ponto'}</Botao>
      </div>
    </form>
  );
}
