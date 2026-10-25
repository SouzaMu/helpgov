-- Substitua a senha antes de executar. Não versionar uma cópia com senha real.
-- O usuário da aplicação só consulta o catálogo e grava contatos.

CREATE USER IF NOT EXISTS 'helpgov_app'@'localhost' IDENTIFIED BY 'troque-esta-senha';

GRANT SELECT ON helpgov.catalog_metadata TO 'helpgov_app'@'localhost';
GRANT SELECT ON helpgov.official_sources TO 'helpgov_app'@'localhost';
GRANT SELECT ON helpgov.contribution_categories TO 'helpgov_app'@'localhost';
GRANT SELECT ON helpgov.contribution_codes TO 'helpgov_app'@'localhost';
GRANT SELECT ON helpgov.contribution_code_rules TO 'helpgov_app'@'localhost';
GRANT SELECT ON helpgov.contribution_code_tags TO 'helpgov_app'@'localhost';
GRANT INSERT ON helpgov.contact_messages TO 'helpgov_app'@'localhost';

FLUSH PRIVILEGES;
