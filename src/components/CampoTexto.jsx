export default function CampoTexto({ id, titulo, erro, dica, multiline = false, ...props }) {
  const classe = `form-control ${erro ? 'input-error' : ''}`;
  return (
    <div className="form-field">
      <label htmlFor={id}>{titulo}{props.required && <span className="required"> *</span>}</label>
      {multiline ? (
        <textarea id={id} className={classe} aria-invalid={Boolean(erro)} aria-describedby={erro ? `${id}-erro` : undefined} {...props} />
      ) : (
        <input id={id} className={classe} aria-invalid={Boolean(erro)} aria-describedby={erro ? `${id}-erro` : undefined} {...props} />
      )}
      {erro ? <small id={`${id}-erro`} className="field-error">{erro}</small> : dica ? <small className="field-hint">{dica}</small> : null}
    </div>
  );
}
