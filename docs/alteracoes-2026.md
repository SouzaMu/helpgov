# Alterações de produção — 30/07/2026

## Dados do INSS

- Substituída a base demonstrativa de 8 itens por uma base versionada com **37 códigos** de pessoa física e complementação.
- Incluídos os códigos solicitados `1007`, `1104`, `1163`, `1287`, `1406`, `1473` e `1929`, além de seus equivalentes trimestrais, modalidades rurais, baixa renda, segurado especial, doméstico, complementações e `1910` para MEI.
- Para cada código, registradas descrição, categoria, plano, periodicidade, alíquota, base, vencimento, elegibilidade, regras e termos de busca.
- Adicionados salário mínimo de R$ 1.621,00 e teto de R$ 8.475,55, válidos desde a competência janeiro de 2026, com links para INSS e Receita Federal.
- Explicitado o recorte: a tabela cobre escolhas de recolhimento de pessoa física/complementação; códigos administrativos, empresariais e de uso exclusivo não são opções do segurado e não são mostrados.

## Arquitetura e qualidade de código

- Removida a duplicação de cabeçalho, rodapé, tema, cards, busca de dados e favoritos por meio de módulos compartilhados.
- Separados scripts reutilizáveis em `assets/js/shared/` e controladores por página em `assets/js/pages/`.
- Centralizada toda a informação previdenciária em `data/codigos.json`; catálogo e simulador usam a mesma base.
- Substituído Bootstrap por CSS próprio, removendo dependência de CDN e scripts não utilizados.
- Corrigido o bug de URL que removia o parâmetro `codigo` depois de abrir uma ficha.
- Removida a antiga interface demonstrativa e textos inconsistentes; páginas agora usam codificação UTF-8 e conteúdo consolidado.

## Experiência e interface

- Novo design responsivo com tokens de cor, cartões, tipografia, espaçamento e grade adaptativa.
- Busca instantânea inteligente por número ou descrição e filtros de categoria.
- Ficha detalhada do código com ação de favoritar e caminho para o simulador.
- Criadas telas de simulador, favoritos e FAQ pesquisável.
- Implementados modo escuro persistente e animações discretas.

## Acessibilidade

- Inserido atalho “Pular para o conteúdo”, landmarks semânticos, `aria-live` para estados de busca, rótulos de formulário e foco de alto contraste.
- FAQ usa elementos nativos `details`/`summary`; botões de favoritos informam estado com `aria-pressed`.
- A navegação e os controles principais funcionam por teclado.
- Preferência `prefers-reduced-motion` desativa animações e rolagem suave.

## Segurança e robustez

- Renderização dinâmica passa a usar nós DOM/texto para conteúdo do JSON, mitigando XSS de dados.
- Formulário de contato ganhou validação de formato, limites de tamanho, cabeçalhos defensivos, método e `Content-Type` restritos no PHP.
- Histórico: os registros locais foram migrados de `php/contatos.log` para `storage/contacts.ndjson`, protegido por `.htaccess` e ignorado pelo Git; essa solução transitória foi substituída pelo banco em 04/08/2026.
- Mensagens de erro orientam o uso de um servidor local quando o `fetch` do JSON não puder ser executado.

## Validação realizada

- JSON validado: 37 códigos, 8 categorias e nenhum código duplicado.
- Navegação local verificada no navegador integrado: carregamento da home, estatísticas, busca inteligente, ficha do código 1007 e preservação de URL.
- Não havia `node` nem `php` expostos no `PATH`; a validação PHP deve ser executada no XAMPP com `C:\xampp\php\php.exe -l php\enviar-contato.php` antes do deploy.

## Banco de dados — 04/08/2026

- Criado esquema MySQL/MariaDB com `utf8mb4` para metadados, fontes oficiais, categorias, códigos, regras, tags e mensagens de contato.
- Criado importador CLI transacional que lê `data/codigos.json`, faz upsert dos registros ativos, atualiza regras/tags e preserva códigos removidos como inativos.
- Criada `php/catalogo.php`, API pública de leitura que devolve o mesmo contrato consumido pela interface. O front consulta a API antes do JSON de fallback.
- Substituído o armazenamento de contatos em arquivo por `contact_messages`, via PDO e prepared statement. Na ausência do banco, o endpoint devolve HTTP 503 sem persistir dados localmente.
- Centralizada a configuração de conexão em `php/lib/database.php`, com credenciais em variáveis de ambiente e exemplo de privilégios mínimos para a conta web.
- Bloqueado o acesso HTTP aos arquivos de importação e à biblioteca de conexão por `.htaccess`; documentado o procedimento completo em `database/README.md`.
