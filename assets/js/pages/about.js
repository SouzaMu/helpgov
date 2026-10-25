(function () {
  'use strict';
  const HG = window.HelpGov;
  HG.loadDatabase().then((database) => {
    const list = HG.byId('source-list');
    list.replaceChildren();
    database.fontes.forEach((source) => {
      const item = HG.create('li');
      const link = HG.create('a', { text: source.titulo, attrs: { href: source.url, target: '_blank', rel: 'noopener noreferrer' } });
      item.append(link, HG.create('span', { text: source.url }));
      list.append(item);
    });
  }).catch(() => { HG.byId('source-list').textContent = 'Não foi possível carregar a lista de fontes.'; });
}());
