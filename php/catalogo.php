<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: public, max-age=300, stale-while-revalidate=60');

require_once __DIR__ . DIRECTORY_SEPARATOR . 'lib' . DIRECTORY_SEPARATOR . 'database.php';

function catalogResponse(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

try {
    $pdo = helpgovDatabase();
    $metadata = $pdo->query('SELECT data_version, verified_at, validity_label, legal_notice, minimum_wage, social_security_ceiling, competence_start FROM catalog_metadata WHERE id = 1')->fetch();

    if ($metadata === false) {
        throw new RuntimeException('Catálogo ainda não importado.');
    }

    $categories = $pdo->query('SELECT id, name, description FROM contribution_categories WHERE is_active = 1 ORDER BY name')->fetchAll();
    $codes = $pdo->query(
        'SELECT code, category_id, name, official_description, plan, periodicity, rate, rate_label, calculation_base,
                due_description, eligibility, calculation_type, period_multiplier
         FROM contribution_codes WHERE is_active = 1 ORDER BY code'
    )->fetchAll();
    $rules = $pdo->query(
        'SELECT code, body FROM contribution_code_rules
         WHERE code IN (SELECT code FROM contribution_codes WHERE is_active = 1)
         ORDER BY code, position'
    )->fetchAll();
    $tags = $pdo->query(
        'SELECT code, tag FROM contribution_code_tags
         WHERE code IN (SELECT code FROM contribution_codes WHERE is_active = 1)
         ORDER BY code, tag'
    )->fetchAll();
    $sources = $pdo->query('SELECT title, url FROM official_sources ORDER BY id')->fetchAll();

    $rulesByCode = [];
    foreach ($rules as $rule) {
        $rulesByCode[$rule['code']][] = $rule['body'];
    }
    $tagsByCode = [];
    foreach ($tags as $tag) {
        $tagsByCode[$tag['code']][] = $tag['tag'];
    }

    $payloadCodes = [];
    foreach ($codes as $code) {
        $item = [
            'codigo' => $code['code'],
            'nome' => $code['name'],
            'descricao_oficial' => $code['official_description'],
            'categoria_id' => $code['category_id'],
            'plano' => $code['plan'],
            'periodicidade' => $code['periodicity'],
            'aliquota' => $code['rate'] === null ? $code['rate_label'] : (float) $code['rate'],
            'base' => $code['calculation_base'],
            'vencimento' => $code['due_description'],
            'elegibilidade' => $code['eligibility'],
            'regras' => $rulesByCode[$code['code']] ?? [],
            'tags' => $tagsByCode[$code['code']] ?? [],
            'calculo' => $code['calculation_type'],
        ];
        if ((int) $code['period_multiplier'] > 1) {
            $item['multiplicador_periodo'] = (int) $code['period_multiplier'];
        }
        $payloadCodes[] = $item;
    }

    catalogResponse(200, [
        'versao' => $metadata['data_version'],
        'verificado_em' => $metadata['verified_at'],
        'vigencia' => $metadata['validity_label'],
        'aviso' => $metadata['legal_notice'],
        'parametros' => [
            'salario_minimo' => (float) $metadata['minimum_wage'],
            'teto_previdenciario' => (float) $metadata['social_security_ceiling'],
            'competencia_inicio' => substr($metadata['competence_start'], 0, 7),
        ],
        'fontes' => array_map(static function (array $source): array {
            return ['titulo' => $source['title'], 'url' => $source['url']];
        }, $sources),
        'categorias' => array_map(static function (array $category): array {
            return ['id' => $category['id'], 'nome' => $category['name'], 'descricao' => $category['description']];
        }, $categories),
        'codigos' => $payloadCodes,
    ]);
} catch (Throwable $exception) {
    catalogResponse(503, ['ok' => false, 'error' => 'Catálogo temporariamente indisponível.']);
}
