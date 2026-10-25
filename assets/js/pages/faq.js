(function () {
  'use strict';
  const HG = window.HelpGov;
  const items = [
    ['Qual é o vencimento da GPS?', 'Para contribuinte individual, facultativo e segurado especial que recolhem por conta própria, o vencimento é, em regra, o dia 15 do mês seguinte à competência. Quando não houver expediente bancário, passa para o próximo dia útil. Códigos trimestrais vencem no dia 15 do mês seguinte ao encerramento do trimestre.'],
    ['O que é o Plano Simplificado?', 'É a contribuição de 11% sobre o salário mínimo para contribuinte individual que trabalha por conta própria e não presta serviço a empresa, ou para segurado facultativo. Ela não dá direito à aposentadoria por tempo de contribuição nem à CTC sem a complementação de 9%.'],
    ['Quem pode usar o código 1929?', 'É o Facultativo Baixa Renda mensal. A pessoa não pode exercer atividade remunerada nem possuir renda formal própria, deve dedicar-se exclusivamente ao trabalho doméstico no próprio lar, pertencer a família com renda mensal de até dois salários mínimos e ter CadÚnico atualizado.'],
    ['MEI usa GPS?', 'A contribuição previdenciária regular do MEI é recolhida pelo DAS-MEI, com vencimento no dia 20 do mês seguinte. O código 1910 é usado para complementação mensal de 15%, quando cabível; confirme a necessidade no SAL.'],
    ['Posso recolher trimestralmente?', 'A tabela oficial apresenta códigos trimestrais para situações específicas. Antes de usar essa opção, confirme no SAL se ela se aplica ao seu caso e à base de contribuição.'],
    ['Onde emito a GPS?', 'Acesse o Meu INSS e clique em "Emitir Guia de Pagamento (GPS)" para ser direcionado ao SAL da Receita Federal. Lá, selecione o módulo de acordo com o seu caso:\n\n• Filiados até 28/11/1999: Autônomos, empresários, domésticos e facultativos antigos.\n• Filiados a partir de 29/11/1999: Contribuintes individuais, domésticos e facultativos atuais.\n• Empresas e Órgãos Públicos: Para regularização de CNPJ e entidades públicas.'],
    ['Como vejo se a contribuição foi registrada?', 'Consulte o Extrato de Contribuições (CNIS) no Meu INSS. Se houver divergência, busque orientação pelos canais oficiais antes de fazer novo recolhimento.']
  ];
  const list = HG.byId('faq-list');
  const render = (term = '') => {
    const normalized = HG.normalize(term);
    const filtered = items.filter(([question, answer]) => HG.normalize(`${question} ${answer}`).includes(normalized));
    list.replaceChildren();
    filtered.forEach(([question, answer]) => {
      const detail = HG.create('details', { className: 'faq-item' });
      const summary = HG.create('summary', { text: question });
      const content = HG.create('div', { className: 'faq-item__answer' });
      content.append(HG.create('p', { text: answer }));
      detail.append(summary, content);
      list.append(detail);
    });
    HG.byId('faq-summary').textContent = filtered.length ? HG.plural(filtered.length, 'resposta encontrada', 'respostas encontradas') : 'Nenhuma resposta encontrada';
  };
  render();
  HG.byId('faq-search').addEventListener('input', HG.debounce((event) => render(event.target.value)));
}());
