# Requisitos do sistema

## Requisitos funcionais

- **RF01:** buscar códigos por número, descrição, plano, elegibilidade e tags.
- **RF02:** filtrar códigos por categoria de segurado.
- **RF03:** exibir ficha completa com alíquota, base, periodicidade, vencimento, elegibilidade e regras.
- **RF04:** aceitar link direto para uma ficha por `codigo.html?codigo=XXXX`.
- **RF05:** simular contribuições dos códigos com base determinável, respeitando mínimo, teto e multiplicador trimestral.
- **RF06:** permitir salvar/remover favoritos no navegador.
- **RF07:** pesquisar perguntas frequentes.
- **RF08:** alternar tema claro/escuro.
- **RF09:** validar o contato no cliente e no servidor e retornar estado compreensível.

## Requisitos não funcionais

- **RNF01:** funcionar em telas pequenas, médias e grandes sem dependência de framework visual.
- **RNF02:** manter a tabela de dados versionada, com vigência e links para fontes oficiais.
- **RNF03:** preservar acessibilidade por teclado, foco visível, semântica HTML e anúncios de estado.
- **RNF04:** não inserir dados remotos com HTML interpretável.
- **RNF05:** respeitar preferência de redução de movimento.
- **RNF06:** persistir catálogo e contatos em MySQL/MariaDB com UTF-8, integridade referencial, importação transacional e credenciais fora do repositório.
- **RNF07:** não expor os registros de contato por HTTP nem versioná-los; a conta web deve ter somente os privilégios mínimos necessários.
- **RNF08:** informar que o resultado é orientativo e direcionar à confirmação no Meu INSS/SAL.
