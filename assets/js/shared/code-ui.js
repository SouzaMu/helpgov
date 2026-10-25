(function () {
  'use strict';

  const namespace = window.HelpGov || {};

  const favoriteButton = (code) => {
    const active = namespace.favorites.has(code);
    const button = namespace.create('button', {
      className: 'icon-button favorite-button',
      attrs: {
        type: 'button',
        'aria-pressed': String(active),
        'aria-label': `${active ? 'Remover' : 'Adicionar'} código ${code} dos favoritos`,
        title: active ? 'Remover dos favoritos' : 'Adicionar aos favoritos'
      }
    });
    button.innerHTML = '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="m12 3 2.78 5.63 6.22.9-4.5 4.38 1.06 6.19L12 17.18 6.44 20.1 7.5 13.91 3 9.53l6.22-.9L12 3Z"/></svg>';
    button.classList.toggle('is-active', active);
    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      const isActive = namespace.favorites.toggle(code);
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
      button.setAttribute('aria-label', `${isActive ? 'Remover' : 'Adicionar'} código ${code} dos favoritos`);
      button.setAttribute('title', isActive ? 'Remover dos favoritos' : 'Adicionar aos favoritos');
      namespace.announce(`Código ${code} ${isActive ? 'adicionado aos' : 'removido dos'} favoritos.`);
    });
    return button;
  };

  namespace.renderCodeCard = (item, database) => {
    const category = namespace.findCategory(database, item.categoria_id);
    const article = namespace.create('article', { className: 'code-card reveal' });
    const heading = namespace.create('h3', { className: 'code-card__title', text: item.nome });
    const link = namespace.create('a', {
      className: 'code-card__link',
      attrs: { href: `${namespace.root()}pages/codigo.html?codigo=${encodeURIComponent(item.codigo)}`, 'aria-label': `Ver detalhes do código ${item.codigo}: ${item.nome}` }
    });
    const labels = namespace.create('div', { className: 'code-card__labels' });
    labels.append(
      namespace.create('span', { className: 'code-number', text: item.codigo }),
      namespace.create('span', { className: 'tag', text: category ? category.nome : 'Código INSS' })
    );
    const meta = namespace.create('p', { className: 'code-card__meta', text: `${namespace.rate(item.aliquota)} · ${item.periodicidade}` });
    const description = namespace.create('p', { className: 'code-card__description', text: item.elegibilidade });
    link.append(labels, heading, meta, description);
    article.append(link, favoriteButton(item.codigo));
    return article;
  };

  namespace.renderCodeCards = (container, codes, database, emptyText = 'Nenhum código encontrado.') => {
    container.replaceChildren();
    if (!codes.length) {
      container.append(namespace.create('p', { className: 'empty-state', text: emptyText }));
      return;
    }
    codes.forEach((item) => container.append(namespace.renderCodeCard(item, database)));
  };

  window.HelpGov = namespace;
}());
