(function () {
  'use strict';

  const namespace = window.HelpGov || {};
  const numberFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  namespace.byId = (id) => document.getElementById(id);
  namespace.normalize = (value) => String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .trim();
  namespace.currency = (value) => numberFormatter.format(Number(value || 0));
  namespace.rate = (value) => typeof value === 'number' ? `${value}%` : String(value || 'Conforme apuração');
  namespace.root = () => document.documentElement.dataset.root || './';
  namespace.debounce = (callback, delay = 180) => {
    let timer;
    return (...args) => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => callback(...args), delay);
    };
  };
  namespace.announce = (message) => {
    const region = document.getElementById('announcements');
    if (region) region.textContent = message;
  };
  namespace.create = (tag, options = {}) => {
    const element = document.createElement(tag);
    if (options.className) element.className = options.className;
    if (options.text !== undefined) element.textContent = options.text;
    if (options.html !== undefined) element.innerHTML = options.html;
    if (options.attrs) {
      Object.entries(options.attrs).forEach(([key, value]) => element.setAttribute(key, value));
    }
    return element;
  };
  namespace.plural = (amount, singular, pluralForm) => `${amount} ${amount === 1 ? singular : pluralForm}`;

  window.HelpGov = namespace;
}());
