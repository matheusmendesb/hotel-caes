# Importa o conector responsável pela comunicação com o MySQL.
import mysql.connector

# Importa as configurações de conexão do projeto.
from backend.config import (
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
    DB_PORT
)


# Cria e retorna uma conexão com o banco de dados.
def conectar():
    return mysql.connector.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME,
        port=DB_PORT
    )
