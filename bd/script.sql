-- Script de criação do banco de dados para o Hotel de Cães

CREATE TABLE IF NOT EXISTS cao (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    raca TEXT NOT NULL,
    sexo TEXT CHECK(sexo IN ('Macho', 'Fêmea')) NOT NULL,
    peso REAL NOT NULL,
    porte TEXT CHECK(porte IN ('Pequeno', 'Médio', 'Grande')) NOT NULL,
    idade INTEGER NOT NULL,
    castrado INTEGER NOT NULL, -- 0 para Não, 1 para Sim
    observacoes TEXT
);