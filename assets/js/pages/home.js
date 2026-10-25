(function () {
  'use strict';

  const HG = window.HelpGov;
  const searchInput = HG.byId('home-search');
  const form = HG.byId('home-search-form');
  const results = HG.byId('home-results');
  const resultSection = HG.byId('home-result-section');
  let database;

  const renderSearch = () => {
    const term = searchInput.value;
    const matching = HG.searchCodes(database.codigos, term).slice(0, 6);
    resultSection.hidden = !term.trim();
    if (!term.trim()) return;
    HG.renderCodeCards(results, matching, database, 'Não encontramos esse código ou descrição. Tente palavras como “facultativo”, “rural” ou “simplificado”.');
    HG.byId('home-result-summary').textContent = matching.length
      ? `${HG.plural(matching.length, 'resultado encontrado', 'resultados encontrados')} para “${term.trim()}”.`
      : 'Nenhum resultado encontrado.';
  };

  HG.loadDatabase().then((data) => {
    database = data;
    HG.byId('stat-codes').textContent = data.codigos.length;
    HG.byId('stat-minimum').textContent = HG.currency(data.parametros.salario_minimo);
    HG.byId('stat-ceiling').textContent = HG.currency(data.parametros.teto_previdenciario);
    const featured = ['1007', '1163', '1406', '1473', '1929', '1910']
      .map((code) => HG.findCode(data, code))
      .filter(Boolean);
    HG.renderCodeCards(HG.byId('featured-codes'), featured, data);
    searchInput.disabled = false;
    HG.byId('home-search-button').disabled = false;
  }).catch((error) => {
    HG.byId('home-search-status').textContent = `${error.message} Abra o site por um servidor local (Apache, Live Server ou similar).`;
    HG.byId('home-search-status').classList.add('is-error');
  });

  searchInput.addEventListener('input', HG.debounce(() => {
    if (database) renderSearch();
  }));
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!database) return;
    const term = searchInput.value.trim();
    const exact = database.codigos.find((item) => item.codigo === term.replace(/\D/g, ''));
    const destination = exact
      ? `${HG.root()}pages/codigo.html?codigo=${encodeURIComponent(exact.codigo)}`
      : `${HG.root()}pages/codigo.html?q=${encodeURIComponent(term)}`;
    window.location.assign(destination);
  });
}());
