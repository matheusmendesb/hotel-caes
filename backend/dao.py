# Importa a função responsável por abrir a conexão com o MySQL.
from backend.database import conectar


# ==========================================================
# OPERAÇÕES DE TUTORES
# ==========================================================

# Cadastra um novo tutor no banco de dados.
def cadastrar_tutor(tutor):
    conexao = conectar()
    cursor = conexao.cursor()

    try:
        sql = """
            INSERT INTO tutor (nome, telefone, email, morada)
            VALUES (%s, %s, %s, %s)
        """

        valores = (
            tutor.nome,
            tutor.telefone,
            tutor.email,
            tutor.morada
        )

        cursor.execute(sql, valores)
        conexao.commit()

    finally:
        cursor.close()
        conexao.close()


# Retorna todos os tutores com o endereço no nome esperado pelo frontend.
def listar_tutores():
    conexao = conectar()
    cursor = conexao.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT
                id_tutor,
                nome,
                telefone,
                email,
                morada AS endereco
            FROM tutor
        """)

        return cursor.fetchall()

    finally:
        cursor.close()
        conexao.close()


# Atualiza os dados de um tutor pelo ID.
def editar_tutor(id_tutor, tutor):
    conexao = conectar()
    cursor = conexao.cursor()

    try:
        sql = """
            UPDATE tutor
            SET nome = %s, telefone = %s, email = %s, morada = %s
            WHERE id_tutor = %s
        """

        valores = (
            tutor.nome,
            tutor.telefone,
            tutor.email,
            tutor.morada,
            id_tutor
        )

        cursor.execute(sql, valores)
        conexao.commit()

        return cursor.rowcount > 0

    finally:
        cursor.close()
        conexao.close()


# Exclui um tutor pelo ID.
def excluir_tutor(id_tutor):
    conexao = conectar()
    cursor = conexao.cursor()

    try:
        cursor.execute(
            "DELETE FROM tutor WHERE id_tutor = %s",
            (id_tutor,)
        )

        conexao.commit()

        return cursor.rowcount > 0

    finally:
        cursor.close()
        conexao.close()


# ==========================================================
# OPERAÇÕES DE CÃES
# ==========================================================

def cadastrar_cao(cao):
    conexao = conectar()
    cursor = conexao.cursor()

    try:
        sql = """
            INSERT INTO cao
            (
                nome, raca, sexo, peso_atual, porte,
                idade, castrado, observacoes, tutor_id
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """

        valores = (
            cao.nome,
            cao.raca,
            cao.sexo,
            cao.peso_atual,
            cao.porte,
            int(cao.idade),
            cao.castrado,
            cao.observacoes,
            cao.tutor_id
        )

        cursor.execute(sql, valores)
        conexao.commit()

    finally:
        cursor.close()
        conexao.close()


def listar_caes():
    conexao = conectar()
    cursor = conexao.cursor(dictionary=True)

    try:
        cursor.execute("SELECT * FROM cao")
        return cursor.fetchall()

    finally:
        cursor.close()
        conexao.close()


def editar_cao(id_cao, cao):
    conexao = conectar()
    cursor = conexao.cursor()

    try:
        sql = """
            UPDATE cao
            SET nome = %s,
                raca = %s,
                sexo = %s,
                peso_atual = %s,
                porte = %s,
                idade = %s,
                castrado = %s,
                observacoes = %s,
                tutor_id = %s
            WHERE id_cao = %s
        """

        valores = (
            cao.nome,
            cao.raca,
            cao.sexo,
            cao.peso_atual,
            cao.porte,
            int(cao.idade),
            cao.castrado,
            cao.observacoes,
            cao.tutor_id,
            id_cao
        )

        cursor.execute(sql, valores)
        conexao.commit()

        return cursor.rowcount > 0

    finally:
        cursor.close()
        conexao.close()


def excluir_cao(id_cao):
    conexao = conectar()
    cursor = conexao.cursor()

    try:
        cursor.execute(
            "DELETE FROM cao WHERE id_cao = %s",
            (id_cao,)
        )

        conexao.commit()

        return cursor.rowcount > 0

    finally:
        cursor.close()
        conexao.close()


# ==========================================================
# OPERAÇÕES DE HOSPEDAGENS
# ==========================================================

def cadastrar_hospedagem(hospedagem):
    conexao = conectar()
    cursor = conexao.cursor()

    try:
        sql = """
            INSERT INTO hospedagem
            (cao_id, peso_registrado, data_entrada, data_saida)
            VALUES (%s, %s, %s, %s)
        """

        valores = (
            hospedagem.cao_id,
            hospedagem.peso_registrado,
            hospedagem.data_entrada,
            hospedagem.data_saida
        )

        cursor.execute(sql, valores)
        conexao.commit()

    finally:
        cursor.close()
        conexao.close()


def listar_hospedagens():
    conexao = conectar()
    cursor = conexao.cursor(dictionary=True)

    try:
        cursor.execute("SELECT * FROM hospedagem")
        return cursor.fetchall()

    finally:
        cursor.close()
        conexao.close()


def editar_hospedagem(id_hospedagem, hospedagem):
    conexao = conectar()
    cursor = conexao.cursor()

    try:
        sql = """
            UPDATE hospedagem
            SET cao_id = %s,
                peso_registrado = %s,
                data_entrada = %s,
                data_saida = %s
            WHERE id_hospedagem = %s
        """

        valores = (
            hospedagem.cao_id,
            hospedagem.peso_registrado,
            hospedagem.data_entrada,
            hospedagem.data_saida,
            id_hospedagem
        )

        cursor.execute(sql, valores)
        conexao.commit()

        cursor.execute(
            "SELECT id_hospedagem FROM hospedagem WHERE id_hospedagem = %s",
            (id_hospedagem,)
        )

        return cursor.fetchone() is not None

    finally:
        cursor.close()
        conexao.close()


def excluir_hospedagem(id_hospedagem):
    conexao = conectar()
    cursor = conexao.cursor()

    try:
        cursor.execute(
            "DELETE FROM hospedagem WHERE id_hospedagem = %s",
            (id_hospedagem,)
        )

        conexao.commit()

        return cursor.rowcount > 0

    finally:
        cursor.close()
        conexao.close()