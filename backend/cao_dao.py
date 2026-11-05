import sqlite3
import os

class CaoDAO:
    def __init__(self):
        base_dir = os.path.dirname(os.path.abspath(__file__))
        self.db_path = os.path.join(base_dir, "database.sqlite")
        self.criar_tabela()

    def conectar(self):
        return sqlite3.connect(self.db_path)

    def criar_tabela(self):
        conn = self.conectar()
        cursor = conn.cursor()
        cursor.execute('''
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
                data_saida TEXT
            );
        ''')
        conn.commit()
        conn.close()

    def cadastrar(self, cao):
        conn = self.conectar()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO cao (nome, raca, sexo, peso, porte, idade, castrado, observacoes, data_entrada, data_saida)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (cao.nome, cao.raca, cao.sexo, cao.peso, cao.porte, cao.idade, cao.castrado, cao.observacoes, cao.data_entrada, cao.data_saida))
        conn.commit()
        conn.close()