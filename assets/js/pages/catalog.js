(function () {
  'use strict';

  const HG = window.HelpGov;
  const searchInput = HG.byId('code-search');
  const categorySelect = HG.byId('category-filter');
  const codeGrid = HG.byId('code-grid');
  const summary = HG.byId('catalog-summary');
  const detailPanel = HG.byId('code-detail');
  let database;
  let activeCode = null;

  const renderFavoriteAction = (code) => {
    const button = HG.create('button', { className: 'button button--secondary button--small', attrs: { type: 'button' } });
    const refresh = () => {
      const active = HG.favorites.has(code);
      button.textContent = active ? '★ Nos favoritos' : '☆ Adicionar aos favoritos';
      button.setAttribute('aria-pressed', String(active));
    };
    refresh();
    button.addEventListener('click', () => {
      const active = HG.favorites.toggle(code);
      refresh();
      HG.announce(`Código ${code} ${active ? 'adicionado aos' : 'removido dos'} favoritos.`);
    });
    return button;
  };

  const renderDetail = (item) => {
    activeCode = item.codigo;
    const category = HG.findCategory(database, item.categoria_id);
    detailPanel.replaceChildren();
    const card = HG.create('article', { className: 'detail-card reveal' });
    const top = HG.create('div', { className: 'detail-card__top' });
    const headingWrap = HG.create('div');
    headingWrap.append(
      HG.create('span', { className: 'code-number', text: `Código ${item.codigo}` }),
      HG.create('h2', { text: item.nome }),
      HG.create('p', { className: 'detail-subtitle', text: item.descricao_oficial })
    );
    top.append(headingWrap, renderFavoriteAction(item.codigo));
    const grid = HG.create('div', { className: 'detail-grid' });
    [
      ['Categoria', category?.nome || 'Não informada'],
      ['Plano', item.plano],
      ['Alíquota', HG.rate(item.aliquota)],
      ['Periodicidade', item.periodicidade],
      ['Base de cálculo', item.base],
      ['Vencimento', item.vencimento]
    ].forEach(([label, content]) => {
      const cell = HG.create('div', { className: 'detail-item' });
      cell.append(HG.create('span', { text: label }), HG.create('strong', { text: content }));
      grid.append(cell);
    });
    const eligibility = HG.create('section', { className: 'detail-section' });
    eligibility.append(HG.create('h3', { text: 'Quem pode usar' }), HG.create('p', { text: item.elegibilidade }));
    const rules = HG.create('section', { className: 'detail-section' });
    const list = HG.create('ul');
    item.regras.forEach((rule) => list.append(HG.create('li', { text: rule })));
    rules.append(HG.create('h3', { text: 'Regras e cuidados' }), list);
    const actions = HG.create('div', { className: 'details-actions' });
    if (item.calculo !== 'indisponivel') {
      actions.append(HG.create('a', { className: 'button button--small', text: 'Simular contribuição', attrs: { href: `${HG.root()}pages/simulador.html?codigo=${item.codigo}` } }));
    }
    actions.append(HG.create('a', { className: 'button button--secondary button--small', text: 'Emitir GPS no Meu INSS', attrs: { href: 'https://sal.rfb.gov.br/PortalSalInternet/faces/pages/index.xhtml', target: '_blank', rel: 'noreferrer noopener' } }));
    card.append(top, grid, eligibility, rules, actions);
    detailPanel.append(card);
    detailPanel.hidden = false;
    document.title = `${item.codigo} — ${item.nome} | HELPGOV`;
  };

  const updateUrl = () => {
    const params = new URLSearchParams();
    if (activeCode) params.set('codigo', activeCode);
    if (searchInput.value.trim()) params.set('q', searchInput.value.trim());
    if (categorySelect.value !== 'all') params.set('categoria', categorySelect.value);
    const query = params.toString();
    history.replaceState({}, '', `${location.pathname}${query ? `?${query}` : ''}`);
  };

  const renderResults = () => {
    const codes = HG.searchCodes(database.codigos, searchInput.value, categorySelect.value);
    HG.renderCodeCards(codeGrid, codes, database, 'Nenhum código corresponde a esses filtros. Limpe a busca ou escolha outra categoria.');
    summary.textContent = `${HG.plural(codes.length, 'código exibido', 'códigos exibidos')}${searchInput.value.trim() ? ` para “${searchInput.value.trim()}”` : ''}.`;
    updateUrl();
  };

  HG.loadDatabase().then((data) => {
    database = data;
    data.categorias.forEach((category) => {
      categorySelect.append(HG.create('option', { text: category.nome, attrs: { value: category.id } }));
    });
    const params = new URLSearchParams(location.search);
    const category = params.get('categoria');
    if (category && data.categorias.some((item) => item.id === category)) categorySelect.value = category;
    searchInput.value = params.get('q') || '';
    const selectedCode = (params.get('codigo') || '').replace(/\D/g, '');
    const selected = HG.findCode(data, selectedCode);
    if (selected) {
      renderDetail(selected);
      window.setTimeout(() => detailPanel.scrollIntoView({ behavior: 'smooth', block: 'start' }), 40);
    } else if (selectedCode) {
      HG.byId('catalog-status').textContent = `O código ${selectedCode} não está na tabela de consulta.`;
    }
    renderResults();
  }).catch((error) => {
    HG.byId('catalog-status').textContent = `${error.message} Abra o site por um servidor local (Apache, Live Server ou similar).`;
    HG.byId('catalog-status').classList.add('is-error');
  });

  searchInput.addEventListener('input', HG.debounce(() => database && renderResults()));
  categorySelect.addEventListener('change', () => database && renderResults());
  HG.byId('clear-filters').addEventListener('click', () => {
    searchInput.value = '';
    categorySelect.value = 'all';
    activeCode = null;
    detailPanel.hidden = true;
    if (database) renderResults();
    searchInput.focus();
  });
}());