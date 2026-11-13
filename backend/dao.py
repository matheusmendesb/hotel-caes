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

        # Organiza os valores na mesma ordem das colunas do INSERT.
        valores = (
            tutor.nome,
            tutor.telefone,
            tutor.email,
            tutor.morada
        )

        cursor.execute(sql, valores)
        conexao.commit()

    finally:
        # Fecha o cursor e a conexão mesmo se ocorrer algum erro.
        cursor.close()
        conexao.close()


# Retorna todos os tutores cadastrados.
def listar_tutores():
    conexao = conectar()

    # dictionary=True faz cada registro ser retornado como um dicionário.
    cursor = conexao.cursor(dictionary=True)

    try:
        cursor.execute("SELECT * FROM tutor")
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

        # Retorna True se algum registro foi alterado.
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

        # Retorna True se algum tutor foi excluído.
        return cursor.rowcount > 0

    finally:
        cursor.close()
        conexao.close()


# ==========================================================
# OPERAÇÕES DE CÃES
# ==========================================================

# Cadastra um novo cão no banco de dados.
def cadastrar_cao(cao):
    conexao = conectar()
    cursor = conexao.cursor()

    try:
        sql = """
            INSERT INTO cao
            (
                nome,
                raca,
                sexo,
                peso_atual,
                porte,
                idade,
                castrado,
                observacoes,
                tutor_id
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """

        # Os nove valores correspondem exatamente às nove colunas.
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


# Retorna todos os cães cadastrados.
def listar_caes():
    conexao = conectar()
    cursor = conexao.cursor(dictionary=True)

    try:
        cursor.execute("SELECT * FROM cao")
        return cursor.fetchall()

    finally:
        cursor.close()
        conexao.close()


# Atualiza os dados de um cão pelo ID.
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


# Exclui um cão pelo ID.
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

# Cadastra uma hospedagem vinculada a um cão.
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


# Retorna todas as hospedagens cadastradas.
def listar_hospedagens():
    conexao = conectar()
    cursor = conexao.cursor(dictionary=True)

    try:
        cursor.execute("SELECT * FROM hospedagem")
        return cursor.fetchall()

    finally:
        cursor.close()
        conexao.close()


# Atualiza os dados de uma hospedagem pelo ID.
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

        # Confirma se a hospedagem existe.
        # Essa consulta também permite retornar True quando os dados
        # enviados são iguais aos dados que já estavam salvos.
        cursor.execute(
            "SELECT id_hospedagem FROM hospedagem WHERE id_hospedagem = %s",
            (id_hospedagem,)
        )

        return cursor.fetchone() is not None

    finally:
        cursor.close()
        conexao.close()


# Exclui uma hospedagem pelo ID.
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