CREATE DATABASE IF NOT EXISTS hotel_caes;

USE hotel_caes;

CREATE TABLE IF NOT EXISTS tutor (
    id_tutor INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    morada VARCHAR(150)
);

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
    FOREIGN KEY (tutor_id) REFERENCES tutor(id_tutor)
);

CREATE TABLE IF NOT EXISTS hospedagem (
    id_hospedagem INT AUTO_INCREMENT PRIMARY KEY,
    cao_id INT NOT NULL,
    peso_registrado DECIMAL(5,2) NOT NULL,
    data_entrada DATE NOT NULL,
    data_saida DATE,
    FOREIGN KEY (cao_id) REFERENCES cao(id_cao),
    CHECK (data_saida IS NULL OR data_saida >= data_entrada)
);