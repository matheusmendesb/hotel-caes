-- Cria o banco de dados caso ele ainda não exista.
CREATE DATABASE IF NOT EXISTS hotel_caes;

-- Seleciona o banco que será utilizado.
USE hotel_caes;


-- ==========================================================
-- TABELA DE TUTORES
-- ==========================================================

-- Armazena os dados dos responsáveis pelos cães.
CREATE TABLE IF NOT EXISTS tutor (
    id_tutor INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    morada VARCHAR(150)
);


-- ==========================================================
-- TABELA DE CÃES
-- ==========================================================

-- Cada cão pertence a um tutor.
CREATE TABLE IF NOT EXISTS cao (
    id_cao INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    raca VARCHAR(60) NOT NULL,
    sexo ENUM('Macho', 'Fêmea') NOT NULL,
    peso_atual DECIMAL(5,2) NOT NULL,
    porte ENUM('Pequeno', 'Médio', 'Grande') NOT NULL,
    idade INT NOT NULL,
    castrado BOOLEAN NOT NULL,
    observacoes TEXT,
    tutor_id INT NOT NULL,

    -- Relaciona o cão ao tutor responsável.
    FOREIGN KEY (tutor_id) REFERENCES tutor(id_tutor)
);


-- ==========================================================
-- TABELA DE HOSPEDAGENS
-- ==========================================================

-- Registra as hospedagens realizadas pelos cães.
CREATE TABLE IF NOT EXISTS hospedagem (
    id_hospedagem INT AUTO_INCREMENT PRIMARY KEY,
    cao_id INT NOT NULL,
    peso_registrado DECIMAL(5,2) NOT NULL,
    data_entrada DATETIME NOT NULL,
    data_saida DATETIME NULL,

    -- Relaciona a hospedagem ao cão correspondente.
    FOREIGN KEY (cao_id) REFERENCES cao(id_cao),

    -- Garante que a saída não seja anterior à entrada.
    CHECK (data_saida IS NULL OR data_saida >= data_entrada)
);


-- ==========================================================
-- AJUSTES NAS TABELAS EXISTENTES
-- ==========================================================

-- Garante que a idade seja armazenada como número inteiro.
ALTER TABLE cao
MODIFY idade INT NOT NULL;

-- Garante que as datas de hospedagem utilizem data e horário.
-- A data de saída pode permanecer vazia enquanto a hospedagem
-- ainda estiver em andamento.
ALTER TABLE hospedagem
MODIFY data_entrada DATETIME NOT NULL,
MODIFY data_saida DATETIME NULL;