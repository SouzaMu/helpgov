(function () {
  'use strict';
  const HG = window.HelpGov;
  const select = HG.byId('simulation-code');
  const baseInput = HG.byId('contribution-base');
  const baseHelp = HG.byId('base-help');
  const error = HG.byId('simulation-error');
  const output = {
    amount: HG.byId('simulation-amount'),
    code: HG.byId('simulation-code-output'),
    rate: HG.byId('simulation-rate-output'),
    base: HG.byId('simulation-base-output'),
    frequency: HG.byId('simulation-frequency-output')
  };
  let database;

  const selectedItem = () => HG.findCode(database, select.value);
  const calculate = () => {
    const item = selectedItem();
    if (!item) return;
    const minimum = database.parametros.salario_minimo;
    const maximum = database.parametros.teto_previdenciario;
    const fixedBase = item.calculo === 'minimo';
    let base = Number(String(baseInput.value).replace(',', '.'));
    if (fixedBase) base = minimum;
    const validBase = Number.isFinite(base) && base >= minimum && (item.calculo === 'faixa' ? base <= maximum : true);
    if (!validBase) {
      error.textContent = item.calculo === 'faixa'
        ? `Informe uma base entre ${HG.currency(minimum)} e ${HG.currency(maximum)}.`
        : `A base deste código é o salário mínimo de ${HG.currency(minimum)}.`;
      baseInput.setAttribute('aria-invalid', 'true');
      return;
    }
    error.textContent = '';
    baseInput.setAttribute('aria-invalid', 'false');
    const multiplier = item.multiplicador_periodo || 1;
    const value = base * (Number(item.aliquota) / 100) * multiplier;
    output.amount.textContent = HG.currency(value);
    output.code.textContent = `${item.codigo} — ${item.nome}`;
    output.rate.textContent = `${item.aliquota}%`;
    output.base.textContent = `${HG.currency(base)}${multiplier > 1 ? ' por competência' : ''}`;
    output.frequency.textContent = multiplier > 1 ? `Trimestral (${multiplier} competências)` : item.periodicidade;
  };
  const updateCode = () => {
    const item = selectedItem();
    if (!item) return;
    const fixedBase = item.calculo === 'minimo';
    baseInput.disabled = fixedBase;
    baseInput.value = fixedBase ? database.parametros.salario_minimo.toFixed(2) : baseInput.value || database.parametros.salario_minimo.toFixed(2);
    baseHelp.textContent = fixedBase
      ? `A base deste código é o salário mínimo vigente: ${HG.currency(database.parametros.salario_minimo)}.`
      : `Informe uma base de ${HG.currency(database.parametros.salario_minimo)} até ${HG.currency(database.parametros.teto_previdenciario)}.`;
    calculate();
  };

  HG.loadDatabase().then((data) => {
    database = data;
    data.codigos.filter((item) => item.calculo !== 'indisponivel').forEach((item) => {
      select.append(HG.create('option', { text: `${item.codigo} — ${item.nome}`, attrs: { value: item.codigo } }));
    });
    const queryCode = new URLSearchParams(location.search).get('codigo');
    select.value = HG.findCode(data, queryCode)?.calculo !== 'indisponivel' ? queryCode : '1007';
    updateCode();
  }).catch((loadError) => { error.textContent = loadError.message; });

  select.addEventListener('change', () => database && updateCode());
  baseInput.addEventListener('input', HG.debounce(() => database && calculate(), 120));
  HG.byId('simulation-form').addEventListener('submit', (event) => { event.preventDefault(); if (database) calculate(); });
}());
