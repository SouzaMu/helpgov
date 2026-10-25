# HELPGOV

[![Netlify Status](https://api.netlify.com/api/v1/badges/e8e3f2c0-84a1-432d-88f1-helpgov/deploy-status)](https://app.netlify.com/)
![GitHub license](https://img.shields.io/github/license/SouzaMu/helpgov)
![Tech](https://img.shields.io/badge/Tech-HTML5%20%7C%20CSS3%20%7C%20JavaScript-blue)

> Portal acessível e responsivo para consulta orientativa de códigos de contribuição previdenciária do INSS.

O **HELPGOV** foi projetado para simplificar a jornada do contribuinte individual e facultativo no entendimento das alíquotas, regras e códigos de pagamento da previdência social, reduzindo erros na emissão e no recolhimento de guias.

> **Aviso Importante:** O HELPGOV é uma ferramenta exclusivamente informativa. A pessoa usuária deve confirmar sua situação, competência e forma de pagamento nos canais oficiais do INSS e da Receita Federal antes de efetuar qualquer recolhimento.

---

## 🔗 Live Demo

Acesse a aplicação em produção:
👉 [https://helpgov.netlify.app](https://helpgov.netlify.app)

---

## 📸 Demonstração Visual

| Interface Principal (Modo Claro) | Simulador & Filtros (Modo Escuro) |
|---|---|
| ![Home Light](assets/screenshots/home-light.png) | ![Simulador Dark](assets/screenshots/simulador-dark.png) |

---

## 🚀 Funcionalidades & Destaques

- **Catálogo Abrangente:** Consulta a 37 códigos de contribuição com detalhes de alíquotas, vencimentos, categorias e regras específicas.
- **Busca e Filtragem em Tempo Real:** Pesquisa dinâmica no catálogo JSON por número do código ou descrição textual, sem recarregar a página.
- **Simulador de Contribuição:** Algoritmo de recomendação de códigos compatíveis com base no perfil do contribuinte (MEI, Facultativo, Contribuinte Individual, etc.).
- **Favoritos Locais:** Persistência de códigos de interesse via `localStorage` do navegador.
- **Acessibilidade e UX:** Suporte a leitores de tela, navegação por teclado, layout totalmente responsivo e alternância de tema (Claro/Escuro).
- **FAQ Pesquisável & Fontes Oficiais:** Central de dúvidas frequentes e links diretos para as bases governamentais.
- **Formulário de Suporte:** Integrado com **Netlify Forms** para recebimento de mensagens e notificações por e-mail no painel da plataforma.

---

## 🛠️ Tecnologias Utilizadas

- **Front-end:** HTML5, CSS3 e JavaScript puro (Vanilla JS sem frameworks).
- **Dados:** JSON versionado para catálogo e regras previdenciárias.
- **Hospedagem & Forms:** Netlify e Netlify Forms.
- **Backend Opcional (Ambiente Local):** PHP e MySQL/MariaDB para suporte a hospedagens tradicionais ou execução offline local.

---

## 📂 Estrutura do Repositório

```text
├── assets/          # Interface (CSS), UI e scripts JavaScript do portal
├── data/            # Catálogo previdenciário versionado (codigos.json)
├── pages/           # Páginas internas e módulos do site
├── docs/            # Arquitetura, diretrizes e histórico técnico do projeto
├── php/             # Integração alternativa para ambiente local/tradicional
├── database/        # Esquema de banco de dados e importador MySQL/MariaDB
└── scripts/         # Automações de preparação de deploy para Netlify
