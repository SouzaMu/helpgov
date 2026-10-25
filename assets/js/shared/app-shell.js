(function () {
  'use strict';

  const root = document.documentElement.dataset.root || './';
  const page = document.body.dataset.page || '';
  const navItems = [
    ['inicio', 'Início', 'index.html'],
    ['codigos', 'Códigos', 'pages/codigo.html'],
    ['simulador', 'Simulador', 'pages/simulador.html'],
    ['duvidas', 'Perguntas frequentes', 'pages/duvidas.html'],
    ['favoritos', 'Favoritos', 'pages/favoritos.html']
  ];
  const icon = (name) => name === 'sun'
    ? '<svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>'
    : '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M20.6 15.79A9 9 0 0 1 8.21 3.4 9 9 0 1 0 20.6 15.79Z"/></svg>';

  const header = document.getElementById('site-header');
  if (header) {
    header.innerHTML = `
      <a class="skip-link" href="#main-content">Pular para o conteúdo</a>
      <div class="site-header__inner container">
        <a class="brand" href="${root}index.html" aria-label="HELPGOV, página inicial"><span class="brand__mark" aria-hidden="true">H</span><span>HELPGOV</span></a>
        <button class="menu-toggle" type="button" aria-controls="primary-navigation" aria-expanded="false"><span class="sr-only">Abrir menu</span><span></span><span></span><span></span></button>
        <nav id="primary-navigation" class="primary-navigation" aria-label="Principal">
          ${navItems.map(([id, label, href]) => `<a href="${root}${href}" ${page === id ? 'aria-current="page"' : ''}>${label}</a>`).join('')}
          <a href="${root}pages/sobre.html" ${page === 'sobre' ? 'aria-current="page"' : ''}>Sobre</a>
          <a href="${root}pages/contato.html" ${page === 'contato' ? 'aria-current="page"' : ''}>Contato</a>
        </nav>
        <button class="theme-toggle icon-button" type="button" aria-label="Ativar modo escuro" title="Alternar tema">${icon('moon')}</button>
      </div>`;
  }

  const footer = document.getElementById('site-footer');
  if (footer) {
    footer.innerHTML = `<div class="container footer__inner"><div><a class="brand brand--footer" href="${root}index.html"><span class="brand__mark" aria-hidden="true">H</span><span>HELPGOV</span></a><p>Consulta orientativa de códigos de contribuição previdenciária.</p></div><div><strong>Dados oficiais</strong><p>Base verificada para a competência de janeiro de 2026. Confirme sempre no Meu INSS/SAL antes de pagar.</p></div><div class="footer__links"><a href="${root}pages/sobre.html#fontes">Fontes e metodologia</a><a href="${root}pages/contato.html">Contato</a></div></div>`;
  }

  const themeToggle = document.querySelector('.theme-toggle');
  const applyTheme = (theme) => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('helpgov:theme', theme);
    if (themeToggle) {
      const dark = theme === 'dark';
      themeToggle.innerHTML = icon(dark ? 'sun' : 'moon');
      themeToggle.setAttribute('aria-label', dark ? 'Ativar modo claro' : 'Ativar modo escuro');
      themeToggle.setAttribute('title', dark ? 'Ativar modo claro' : 'Ativar modo escuro');
    }
  };
  const savedTheme = localStorage.getItem('helpgov:theme');
  applyTheme(savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  themeToggle?.addEventListener('click', () => applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));

  const menuToggle = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.primary-navigation');
  menuToggle?.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    navigation.classList.toggle('is-open', !isOpen);
  });
  navigation?.addEventListener('click', (event) => {
    if (event.target.matches('a') && window.innerWidth < 850) {
      navigation.classList.remove('is-open');
      menuToggle?.setAttribute('aria-expanded', 'false');
    }
  });
}());
