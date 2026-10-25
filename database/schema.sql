-- HELPGOV — esquema MySQL 8.0+ / MariaDB 10.4+
-- Execute este arquivo uma única vez com um usuário administrador do banco.

CREATE DATABASE IF NOT EXISTS helpgov
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE helpgov;

CREATE TABLE IF NOT EXISTS catalog_metadata (
  id TINYINT UNSIGNED NOT NULL PRIMARY KEY,
  data_version VARCHAR(20) NOT NULL,
  verified_at DATE NOT NULL,
  validity_label VARCHAR(120) NOT NULL,
  legal_notice TEXT NOT NULL,
  minimum_wage DECIMAL(10,2) NOT NULL,
  social_security_ceiling DECIMAL(10,2) NOT NULL,
  competence_start DATE NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS official_sources (
  id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  url VARCHAR(2048) NOT NULL,
  UNIQUE KEY uq_official_sources_url (url(255))
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS contribution_categories (
  id VARCHAR(40) NOT NULL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  description TEXT NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS contribution_codes (
  code CHAR(4) NOT NULL PRIMARY KEY,
  category_id VARCHAR(40) NOT NULL,
  name VARCHAR(255) NOT NULL,
  official_description TEXT NOT NULL,
  plan VARCHAR(120) NOT NULL,
  periodicity VARCHAR(80) NOT NULL,
  rate DECIMAL(5,2) NULL,
  rate_label VARCHAR(120) NULL,
  calculation_base TEXT NOT NULL,
  due_description TEXT NOT NULL,
  eligibility TEXT NOT NULL,
  calculation_type VARCHAR(20) NOT NULL,
  period_multiplier TINYINT UNSIGNED NOT NULL DEFAULT 1,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_contribution_codes_category
    FOREIGN KEY (category_id) REFERENCES contribution_categories (id),
  KEY idx_contribution_codes_category_active (category_id, is_active),
  KEY idx_contribution_codes_calculation (calculation_type, is_active)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS contribution_code_rules (
  code CHAR(4) NOT NULL,
  position TINYINT UNSIGNED NOT NULL,
  body TEXT NOT NULL,
  PRIMARY KEY (code, position),
  CONSTRAINT fk_contribution_code_rules_code
    FOREIGN KEY (code) REFERENCES contribution_codes (code) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS contribution_code_tags (
  code CHAR(4) NOT NULL,
  tag VARCHAR(100) NOT NULL,
  PRIMARY KEY (code, tag),
  CONSTRAINT fk_contribution_code_tags_code
    FOREIGN KEY (code) REFERENCES contribution_codes (code) ON DELETE CASCADE,
  KEY idx_contribution_code_tags_tag (tag)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS contact_messages (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  requester_name VARCHAR(120) NOT NULL,
  requester_email VARCHAR(254) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'new',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  read_at TIMESTAMP NULL DEFAULT NULL,
  KEY idx_contact_messages_status_created (status, created_at)
) ENGINE=InnoDB;
