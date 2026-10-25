# Arquitetura

## Visão geral

O HELPGOV é uma aplicação estática, sem framework e sem dependências de interface externas. A arquitetura separa conteúdo, componentes compartilhados e comportamentos de página para reduzir duplicação e tornar a revisão da base previdenciária segura.

```text
HTML de página → shell compartilhado → módulos de página
                         ↓
              utilitários + dados + favoritos + cards
                         ↓
          API PHP → MySQL/MariaDB ← importador do JSON
                         ↓
            data/codigos.json (origem e fallback público)
```

## Camadas

| Camada | Responsabilidade |
| --- | --- |
| `data/` | Catálogo versionado: parâmetros de vigência, fontes oficiais, categorias e códigos; é fonte de importação e fallback. |
| `database/` | Esquema relacional, importador transacional e modelo de privilégios mínimos para MySQL/MariaDB. |
| `assets/js/shared/` | Funções reutilizáveis: busca, carregamento de dados, favoritos, renderização segura de cards e navegação/tema. |
| `assets/js/pages/` | Controladores pequenos por página: início, catálogo, simulador, favoritos, FAQ, sobre e contato. |
| `pages/` e `index.html` | Estrutura semântica, títulos, formulários e regiões acessíveis. |
| `assets/css/main.css` | Tokens de design, componentes, responsividade, foco e redução de movimento. |
| `php/` | API de catálogo e endpoint de contato; ambos usam PDO e não expõem erros internos. |

## Decisões técnicas

- **Sem Bootstrap:** remove dependência de CDN, JavaScript não utilizado e estilos concorrentes. O CSS próprio é menor, previsível e funciona offline após o carregamento local.
- **Sem `innerHTML` para conteúdo proveniente do JSON:** os campos da base são inseridos por `textContent`, evitando injeção de HTML ao atualizar dados.
- **Busca ranqueada:** coincidência exata do código, prefixo, nome e termos em descrição/tags recebem prioridade. A normalização elimina diferenças de acento e caixa.
- **Estado local explícito:** favoritos e tema ficam em `localStorage`, sem enviar dados ao servidor.
- **URLs estáveis:** `codigo.html?codigo=1007` abre a ficha correspondente e preserva o código na URL.
- **Banco normalizado:** categorias, códigos, regras e tags são tabelas separadas. Isso evita repetição, preserva relações e permite atualização transacional do catálogo.
- **API com degradação controlada:** a interface consulta `php/catalogo.php`; se a API estiver indisponível, usa o JSON versionado somente para a consulta pública continuar funcional.
- **Fonte de dados única para cálculo:** alíquotas, bases e multiplicadores trimestrais usados no simulador vêm do mesmo contrato de dados exibido no catálogo, seja pela API ou pelo fallback.

## Segurança e privacidade

O endpoint de contato aceita apenas `POST` com JSON, limita tamanho, valida campos no servidor, define cabeçalhos de resposta e grava por prepared statement na tabela `contact_messages`. Credenciais são lidas de variáveis de ambiente, `database/` e `php/lib/` não são acessíveis por HTTP, e o usuário da aplicação recebe apenas `SELECT` no catálogo e `INSERT` nos contatos. Uma integração de produção pode encaminhar as mensagens a um serviço de atendimento, sem substituir esses controles.

## Acessibilidade e desempenho

- landmarks, skip link, rótulos explícitos, regiões `aria-live`, estados `aria-pressed` e foco visível;
- HTML nativo para FAQ (`details`/`summary`) e formulários;
- layout responsivo sem bibliotecas; fontes do sistema e SVGs inline evitam solicitações extras;
- `prefers-reduced-motion` reduz animações e rolagem suave;
- carregamento do JSON uma vez por página, com cache de `Promise`, e renderização limitada dos resultados rápidos na home.
