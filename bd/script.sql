CREATE TABLE IF NOT EXISTS tutor (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    telefone TEXT NOT NULL,
    email TEXT,
    morada TEXT
);

CREATE TABLE IF NOT EXISTS cao (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    raca TEXT NOT NULL,
    sexo TEXT CHECK(sexo IN ('Macho', 'Fêmea')) NOT NULL,
    peso REAL NOT NULL,
    porte TEXT CHECK(porte IN ('Pequeno', 'Médio', 'Grande')) NOT NULL,
    idade INTEGER NOT NULL,
    castrado INTEGER NOT NULL,
    observacoes TEXT,
    data_entrada TEXT NOT NULL,
    data_saida TEXT,
    tutor_id INTEGER,
    FOREIGN KEY (tutor_id) REFERENCES tutor(id)
);

CREATE TABLE IF NOT EXISTS usuario (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL,
    nivel TEXT CHECK(nivel IN ('admin', 'funcionario')) NOT NULL
);