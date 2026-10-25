(function () {
  'use strict';

  const namespace = window.HelpGov || {};
  const storageKey = 'helpgov:favorites:v2';

  const read = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
      return new Set(Array.isArray(saved) ? saved.map(String) : []);
    } catch (_) {
      return new Set();
    }
  };
  const persist = (items) => localStorage.setItem(storageKey, JSON.stringify([...items]));

  namespace.favorites = {
    all: () => [...read()],
    has: (code) => read().has(String(code)),
    toggle: (code) => {
      const items = read();
      const normalizedCode = String(code);
      const active = !items.has(normalizedCode);
      if (active) items.add(normalizedCode); else items.delete(normalizedCode);
      persist(items);
      window.dispatchEvent(new CustomEvent('helpgov:favorites-changed'));
      return active;
    }
  };

  window.HelpGov = namespace;
}());
