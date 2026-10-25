<?php
declare(strict_types=1);

/**
 * Abre uma única conexão PDO por requisição.
 * Variáveis de ambiente permitem trocar as credenciais sem versioná-las:
 * HELPGOV_DB_HOST, HELPGOV_DB_PORT, HELPGOV_DB_NAME,
 * HELPGOV_DB_USER e HELPGOV_DB_PASSWORD.
 */
function helpgovDatabase(): PDO
{
    static $connection = null;

    if ($connection instanceof PDO) {
        return $connection;
    }

    $host = getenv('HELPGOV_DB_HOST') ?: '127.0.0.1';
    $port = getenv('HELPGOV_DB_PORT') ?: '3306';
    $database = getenv('HELPGOV_DB_NAME') ?: 'helpgov';
    $username = getenv('HELPGOV_DB_USER') ?: 'root';
    $password = getenv('HELPGOV_DB_PASSWORD') ?: '';

    if (!preg_match('/^[a-zA-Z0-9_.-]{1,255}$/', $host)
        || !preg_match('/^\d{1,5}$/', $port)
        || !preg_match('/^[a-zA-Z0-9_]{1,64}$/', $database)) {
        throw new RuntimeException('Configuração de banco de dados inválida.');
    }

    $dsn = sprintf('mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4', $host, $port, $database);

    $connection = new PDO($dsn, $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);

    return $connection;
}
