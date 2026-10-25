(function () {
  'use strict';
  const HG = window.HelpGov;
  const form = HG.byId('contact-form');
  const status = HG.byId('contact-status');
  const fields = {
    name: HG.byId('contact-name'),
    email: HG.byId('contact-email'),
    message: HG.byId('contact-message')
  };
  const setStatus = (message, type = '') => {
    status.textContent = message;
    status.className = `form-status${type ? ` is-${type}` : ''}`;
  };
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const payload = { nome: fields.name.value.trim(), email: fields.email.value.trim(), mensagem: fields.message.value.trim() };
    const valid = payload.nome.length >= 2 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email) && payload.mensagem.length >= 10;
    fields.name.setAttribute('aria-invalid', String(payload.nome.length < 2));
    fields.email.setAttribute('aria-invalid', String(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)));
    fields.message.setAttribute('aria-invalid', String(payload.mensagem.length < 10));
    if (!valid) { setStatus('Revise os campos destacados. A mensagem precisa ter ao menos 10 caracteres.', 'error'); return; }
    setStatus('Enviando sua mensagem…');
    try {
      const response = await fetch(`${HG.root()}php/enviar-contato.php`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.ok) throw new Error(result.error || 'Não foi possível registrar a mensagem.');
      form.reset();
      setStatus('Mensagem recebida. Obrigado pelo contato!', 'success');
    } catch (requestError) {
      setStatus(`${requestError.message} Tente novamente mais tarde.`, 'error');
    }
  });
}());
