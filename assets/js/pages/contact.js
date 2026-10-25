(function () {
  'use strict';
  const HG = window.HelpGov;
  const form = HG.byId('contact-form');
  const status = HG.byId('contact-status');
  const submitButton = form.querySelector('button[type="submit"]');
  let sending = false;
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
    if (sending) return;
    const payload = { nome: fields.name.value.trim(), email: fields.email.value.trim(), mensagem: fields.message.value.trim() };
    const validName = payload.nome.length >= 2 && payload.nome.length <= 120;
    const validEmail = payload.email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email);
    const validMessage = payload.mensagem.length >= 10 && payload.mensagem.length <= 4000;
    fields.name.setAttribute('aria-invalid', String(!validName));
    fields.email.setAttribute('aria-invalid', String(!validEmail));
    fields.message.setAttribute('aria-invalid', String(!validMessage));
    if (!validName || !validEmail || !validMessage) {
      setStatus('Revise os campos destacados. Use um nome de 2 a 120 caracteres, um e-mail válido e uma mensagem de 10 a 4.000 caracteres.', 'error');
      form.querySelector('[aria-invalid="true"]').focus();
      return;
    }
    sending = true;
    submitButton.disabled = true;
    form.setAttribute('aria-busy', 'true');
    setStatus('Enviando sua mensagem…');
    try {
      const data = new URLSearchParams(new FormData(form));
      Object.entries(payload).forEach(([key, value]) => data.set(key, value));
      const response = await fetch(form.action, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: data.toString() });
      if (!response.ok) throw new Error('Não foi possível registrar a mensagem.');
      form.reset();
      setStatus('Mensagem recebida. Obrigado pelo contato!', 'success');
    } catch {
      setStatus('Não foi possível registrar a mensagem. Verifique sua conexão e tente novamente. Seus dados foram mantidos no formulário.', 'error');
    } finally {
      sending = false;
      submitButton.disabled = false;
      form.removeAttribute('aria-busy');
    }
  });
}());
