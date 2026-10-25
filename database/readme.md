# Banco de dados do HELPGOV

O banco usa MySQL 8+ ou MariaDB 10.4+ e é compatível com o XAMPP. O catálogo do portal fica normalizado em categorias, códigos, regras e tags; as mensagens de contato ficam em uma tabela separada.

## Criar e importar

1. Inicie o MySQL no painel do XAMPP.
2. A partir da raiz do projeto, crie o esquema:

   ```powershell
   Get-Content -Raw database\schema.sql | & C:\xampp\mysql\bin\mysql.exe -u root -p
   ```

3. Importe o catálogo oficial que já está em `data/codigos.json`:

   ```powershell
   C:\xampp\php\php.exe database\importar-catalogo.php
   ```

4. Confira a carga:

   ```powershell
   & C:\xampp\mysql\bin\mysql.exe -u root -p -e "USE helpgov; SELECT COUNT(*) AS codigos_ativos FROM contribution_codes WHERE is_active = 1;"
   ```

O importador é reexecutável: ele atualiza metadados, categorias, códigos, regras e tags dentro de uma transação. Itens removidos da origem são desativados, sem apagar histórico.

Para validar apenas o arquivo de origem, sem abrir conexão com o banco:

```powershell
C:\xampp\php\php.exe database\importar-catalogo.php --dry-run
```

## Credenciais

O PHP lê as variáveis de ambiente abaixo. Os padrões `127.0.0.1:3306`, banco `helpgov`, usuário `root` e senha vazia existem apenas para facilitar um XAMPP local novo. Em produção, defina todas as variáveis no ambiente do Apache/PHP e use um usuário de acesso restrito.

```text
HELPGOV_DB_HOST=127.0.0.1
HELPGOV_DB_PORT=3306
HELPGOV_DB_NAME=helpgov
HELPGOV_DB_USER=helpgov_app
HELPGOV_DB_PASSWORD=uma-senha-forte
```

Use `privilegios-app.exemplo.sql` como referência para criar o usuário de execução. A conta usada pelo site só precisa de `SELECT` nas tabelas do catálogo e `INSERT` em `contact_messages`; a importação deve usar uma conta administrativa separada.

## Integração da aplicação

- `php/catalogo.php` entrega o catálogo do banco para a interface.
- `assets/js/shared/data.js` tenta a API primeiro e recorre a `data/codigos.json` se o banco estiver temporariamente indisponível, preservando a consulta pública.
- `php/enviar-contato.php` grava contatos com `PDO` e prepared statements. Se a base não estiver disponível, retorna HTTP 503 e não persiste dados em arquivo.
- `database/` e `php/lib/` são bloqueados para acesso HTTP por `.htaccess`.

Não exponha o banco à internet, não coloque senhas em arquivos versionados e mantenha backups criptografados, já que a tabela de contatos contém dados pessoais.
