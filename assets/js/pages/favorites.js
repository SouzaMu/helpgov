(function () {
  'use strict';
  const HG = window.HelpGov;
  let database;
  const render = () => {
    const favoriteCodes = new Set(HG.favorites.all());
    const items = database.codigos.filter((item) => favoriteCodes.has(item.codigo));
    HG.renderCodeCards(HG.byId('favorites-grid'), items, database, 'Você ainda não tem favoritos. Na consulta de códigos, use a estrela para salvar os itens que quer revisar depois.');
    HG.byId('favorites-summary').textContent = items.length ? HG.plural(items.length, 'código salvo', 'códigos salvos') : 'Nenhum código salvo';
  };
  HG.loadDatabase().then((data) => { database = data; render(); });
  window.addEventListener('helpgov:favorites-changed', () => database && render());
}());
