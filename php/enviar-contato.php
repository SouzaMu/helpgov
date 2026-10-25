<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

require_once __DIR__ . DIRECTORY_SEPARATOR . 'lib' . DIRECTORY_SEPARATOR . 'database.php';

function respond(int $status, array $payload): void {
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    respond(405, ['ok' => false, 'error' => 'Método não permitido.']);
}

$contentType = $_SERVER['CONTENT_TYPE'] ?? '';
if (stripos($contentType, 'application/json') !== 0) {
    respond(415, ['ok' => false, 'error' => 'Envie os dados em JSON.']);
}

$raw = file_get_contents('php://input');
if ($raw === false || strlen($raw) > 12000) {
    respond(413, ['ok' => false, 'error' => 'Mensagem muito grande.']);
}

$data = json_decode($raw, true);
if (!is_array($data)) {
    respond(400, ['ok' => false, 'error' => 'Dados inválidos.']);
}

$name = trim((string) ($data['nome'] ?? ''));
$email = trim((string) ($data['email'] ?? ''));
$message = trim((string) ($data['mensagem'] ?? ''));

if (mb_strlen($name) < 2 || mb_strlen($name) > 120 || !filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($email) > 254 || mb_strlen($message) < 10 || mb_strlen($message) > 4000) {
    respond(422, ['ok' => false, 'error' => 'Revise os dados informados.']);
}

try {
    $statement = helpgovDatabase()->prepare(
        'INSERT INTO contact_messages (requester_name, requester_email, message)
         VALUES (:name, :email, :message)'
    );
    $statement->execute([
        ':name' => preg_replace('/[\r\n]+/', ' ', $name),
        ':email' => $email,
        ':message' => preg_replace('/[\r\n]+/', ' ', $message),
    ]);
} catch (Throwable $exception) {
    respond(503, ['ok' => false, 'error' => 'Serviço de contato temporariamente indisponível.']);
}

respond(201, ['ok' => true]);
