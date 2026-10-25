<?php
declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    http_response_code(403);
    exit('A importação só pode ser executada pela linha de comando.');
}

require_once dirname(__DIR__) . DIRECTORY_SEPARATOR . 'php' . DIRECTORY_SEPARATOR . 'lib' . DIRECTORY_SEPARATOR . 'database.php';

$catalogPath = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'data' . DIRECTORY_SEPARATOR . 'codigos.json';
$contents = file_get_contents($catalogPath);
$catalog = $contents === false ? null : json_decode($contents, true);

if (!is_array($catalog) || !isset($catalog['parametros'], $catalog['categorias'], $catalog['codigos'])) {
    fwrite(STDERR, "Não foi possível ler o catálogo em data/codigos.json.\n");
    exit(1);
}

if (in_array('--dry-run', $argv, true)) {
    printf("Catálogo válido: %d categorias e %d códigos prontos para importação.\n", count($catalog['categorias']), count($catalog['codigos']));
    exit(0);
}

try {
    $pdo = helpgovDatabase();
    $pdo->beginTransaction();

    $competence = (string) ($catalog['parametros']['competencia_inicio'] ?? '');
    if (!preg_match('/^\d{4}-\d{2}$/', $competence)) {
        throw new RuntimeException('A competência inicial do catálogo é inválida.');
    }

    $metadata = $pdo->prepare(
        'INSERT INTO catalog_metadata
          (id, data_version, verified_at, validity_label, legal_notice, minimum_wage, social_security_ceiling, competence_start)
         VALUES (1, :version, :verified_at, :validity, :notice, :minimum_wage, :ceiling, :competence)
         ON DUPLICATE KEY UPDATE
          data_version = VALUES(data_version), verified_at = VALUES(verified_at), validity_label = VALUES(validity_label),
          legal_notice = VALUES(legal_notice), minimum_wage = VALUES(minimum_wage),
          social_security_ceiling = VALUES(social_security_ceiling), competence_start = VALUES(competence_start)'
    );
    $metadata->execute([
        ':version' => (string) ($catalog['versao'] ?? '1.0.0'),
        ':verified_at' => (string) ($catalog['verificado_em'] ?? date('Y-m-d')),
        ':validity' => (string) ($catalog['vigencia'] ?? ''),
        ':notice' => (string) ($catalog['aviso'] ?? ''),
        ':minimum_wage' => (float) $catalog['parametros']['salario_minimo'],
        ':ceiling' => (float) $catalog['parametros']['teto_previdenciario'],
        ':competence' => $competence . '-01',
    ]);

    $pdo->exec('DELETE FROM official_sources');
    $sourceStatement = $pdo->prepare('INSERT INTO official_sources (title, url) VALUES (:title, :url)');
    foreach ($catalog['fontes'] ?? [] as $source) {
        $sourceStatement->execute([
            ':title' => (string) ($source['titulo'] ?? ''),
            ':url' => (string) ($source['url'] ?? ''),
        ]);
    }

    $pdo->exec('UPDATE contribution_categories SET is_active = 0');
    $categoryStatement = $pdo->prepare(
        'INSERT INTO contribution_categories (id, name, description, is_active)
         VALUES (:id, :name, :description, 1)
         ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description), is_active = 1'
    );
    foreach ($catalog['categorias'] as $category) {
        $categoryStatement->execute([
            ':id' => (string) $category['id'],
            ':name' => (string) $category['nome'],
            ':description' => (string) $category['descricao'],
        ]);
    }

    $pdo->exec('UPDATE contribution_codes SET is_active = 0');
    $codeStatement = $pdo->prepare(
        'INSERT INTO contribution_codes
          (code, category_id, name, official_description, plan, periodicity, rate, rate_label, calculation_base,
           due_description, eligibility, calculation_type, period_multiplier, is_active)
         VALUES
          (:code, :category_id, :name, :official_description, :plan, :periodicity, :rate, :rate_label, :calculation_base,
           :due_description, :eligibility, :calculation_type, :period_multiplier, 1)
         ON DUPLICATE KEY UPDATE
          category_id = VALUES(category_id), name = VALUES(name), official_description = VALUES(official_description),
          plan = VALUES(plan), periodicity = VALUES(periodicity), rate = VALUES(rate), rate_label = VALUES(rate_label),
          calculation_base = VALUES(calculation_base), due_description = VALUES(due_description), eligibility = VALUES(eligibility),
          calculation_type = VALUES(calculation_type), period_multiplier = VALUES(period_multiplier), is_active = 1'
    );
    $deleteRules = $pdo->prepare('DELETE FROM contribution_code_rules WHERE code = :code');
    $ruleStatement = $pdo->prepare('INSERT INTO contribution_code_rules (code, position, body) VALUES (:code, :position, :body)');
    $deleteTags = $pdo->prepare('DELETE FROM contribution_code_tags WHERE code = :code');
    $tagStatement = $pdo->prepare('INSERT INTO contribution_code_tags (code, tag) VALUES (:code, :tag)');

    foreach ($catalog['codigos'] as $item) {
        $rate = $item['aliquota'] ?? null;
        $numericRate = is_int($rate) || is_float($rate) || (is_string($rate) && is_numeric($rate));
        $codeStatement->execute([
            ':code' => (string) $item['codigo'],
            ':category_id' => (string) $item['categoria_id'],
            ':name' => (string) $item['nome'],
            ':official_description' => (string) $item['descricao_oficial'],
            ':plan' => (string) $item['plano'],
            ':periodicity' => (string) $item['periodicidade'],
            ':rate' => $numericRate ? (float) $rate : null,
            ':rate_label' => $numericRate ? null : (string) $rate,
            ':calculation_base' => (string) $item['base'],
            ':due_description' => (string) $item['vencimento'],
            ':eligibility' => (string) $item['elegibilidade'],
            ':calculation_type' => (string) $item['calculo'],
            ':period_multiplier' => max(1, (int) ($item['multiplicador_periodo'] ?? 1)),
        ]);

        $deleteRules->execute([':code' => (string) $item['codigo']]);
        foreach ($item['regras'] as $position => $rule) {
            $ruleStatement->execute([
                ':code' => (string) $item['codigo'],
                ':position' => $position + 1,
                ':body' => (string) $rule,
            ]);
        }

        $deleteTags->execute([':code' => (string) $item['codigo']]);
        foreach ($item['tags'] as $tag) {
            $tagStatement->execute([':code' => (string) $item['codigo'], ':tag' => (string) $tag]);
        }
    }

    $pdo->commit();
    printf("Importação concluída: %d categorias e %d códigos ativos.\n", count($catalog['categorias']), count($catalog['codigos']));
} catch (Throwable $exception) {
    if (isset($pdo) && $pdo instanceof PDO && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    fwrite(STDERR, "A importação falhou. Verifique a conexão, o esquema e as credenciais do banco.\n");
    exit(1);
}
