(function () {
  'use strict';

  const namespace = window.HelpGov || {};
  let databasePromise;

  namespace.loadDatabase = () => {
    if (!databasePromise) {
      const fetchJson = (url) => fetch(url, { cache: 'no-cache', headers: { Accept: 'application/json' } })
        .then((response) => {
          if (!response.ok) throw new Error(`Não foi possível carregar a base (${response.status}).`);
          return response.json();
        });
      const apiUrl = `${namespace.root()}php/catalogo.php`;
      const fallbackUrl = `${namespace.root()}data/codigos.json`;
      databasePromise = fetchJson(apiUrl).catch(() => fetchJson(fallbackUrl));
    }
    return databasePromise;
  };

  namespace.findCategory = (database, id) => database.categorias.find((category) => category.id === id);
  namespace.findCode = (database, code) => database.codigos.find((item) => item.codigo === String(code));
  namespace.searchCodes = (codes, term, category = 'all') => {
    const normalizedTerm = namespace.normalize(term);
    const terms = normalizedTerm.split(/\s+/).filter(Boolean);

    return codes
      .filter((item) => category === 'all' || item.categoria_id === category)
      .map((item) => {
        const haystack = namespace.normalize([
          item.codigo,
          item.nome,
          item.descricao_oficial,
          item.elegibilidade,
          item.plano,
          ...(item.tags || [])
        ].join(' '));
        let score = 0;
        if (!terms.length) score = 1;
        if (normalizedTerm === item.codigo) score += 100;
        if (item.codigo.startsWith(normalizedTerm)) score += 40;
        if (namespace.normalize(item.nome).includes(normalizedTerm)) score += 25;
        score += terms.reduce((total, itemTerm) => total + (haystack.includes(itemTerm) ? 5 : -20), 0);
        return { item, score };
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score || a.item.codigo.localeCompare(b.item.codigo, 'pt-BR'))
      .map(({ item }) => item);
  };

  window.HelpGov = namespace;
}());
