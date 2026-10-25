# Casos de uso

## UC01 — Encontrar um código

1. A pessoa informa um número ou descrição na home ou no catálogo.
2. O sistema normaliza o termo, busca em código/nome/regras/tags e ordena as melhores correspondências.
3. A pessoa abre a ficha desejada e pode copiar a URL ou seguir para o simulador.

## UC02 — Filtrar por categoria

1. A pessoa seleciona, por exemplo, “Segurado Facultativo” ou “MEI”.
2. O catálogo mostra apenas os itens da categoria e atualiza a URL com o filtro.
3. A pessoa pode limpar os filtros sem recarregar a aplicação.

## UC03 — Simular contribuição

1. A pessoa escolhe um código com cálculo disponível.
2. Para plano normal/dedução, informa a base por competência; para alíquotas reduzidas, a base mínima é preenchida automaticamente.
3. O sistema valida os limites, aplica alíquota e multiplicador trimestral, e mostra o valor estimado.

## UC04 — Guardar favorito

1. A pessoa aciona a estrela de um card ou o botão na ficha.
2. O código é gravado localmente no navegador.
3. A página de favoritos lista os itens e permite removê-los.

## UC05 — Enviar sugestão

1. A pessoa informa nome, e-mail e mensagem sem dados previdenciários sensíveis.
2. O formulário valida formato e tamanho, bloqueia envios duplicados durante o processamento e envia os campos ao Netlify Forms, com proteção antispam.
3. Na hospedagem Netlify, a mensagem é registrada em Forms no painel do projeto; a interface confirma o envio após uma resposta de sucesso. Em caso de falha, os campos são preservados para uma nova tentativa.

Para testar após a publicação, envie uma mensagem completa com um e-mail real e confira as submissões do formulário `contato` no painel Netlify, incluindo a pasta de spam. Mensagens curtas de teste e endereços fictícios podem ser classificados como spam. Notificações por e-mail precisam ser configuradas em Forms > Submission notifications. O endpoint PHP permanece disponível apenas para integrações alternativas em hospedagens com PHP; o formulário publicado na Netlify não depende dele.
