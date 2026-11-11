from backend.database import conectar


def cadastrar_tutor(tutor):
    conexao = conectar()
    cursor = conexao.cursor()

    sql = """
        INSERT INTO tutor (nome, telefone, email, morada)
        VALUES (%s, %s, %s, %s)
    """

    valores = (tutor.nome, tutor.telefone, tutor.email, tutor.morada)

    cursor.execute(sql, valores)
    conexao.commit()

    cursor.close()
    conexao.close()


def cadastrar_cao(cao):
    conexao = conectar()
    cursor = conexao.cursor()

    sql = """
        INSERT INTO cao (
            nome, raca, sexo, peso_atual, porte,
            idade, castrado, observacoes, tutor_id
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    """

    valores = (
        cao.nome, cao.raca, cao.sexo, cao.peso_atual,
        cao.porte, cao.idade, cao.castrado,
        cao.observacoes, cao.tutor_id
    )

    cursor.execute(sql, valores)
    conexao.commit()

    cursor.close()
    conexao.close()


def cadastrar_hospedagem(hospedagem):
    conexao = conectar()
    cursor = conexao.cursor()

    sql = """
        INSERT INTO hospedagem (
            cao_id, peso_registrado, data_entrada, data_saida
        )
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

    cursor.close()
    conexao.close()


def listar_tutores():
    conexao = conectar()
    cursor = conexao.cursor(dictionary=True)

    cursor.execute("SELECT * FROM tutor")
    tutores = cursor.fetchall()

    cursor.close()
    conexao.close()

    return tutores


def listar_caes():
    conexao = conectar()
    cursor = conexao.cursor(dictionary=True)

    cursor.execute("SELECT * FROM cao")
    caes = cursor.fetchall()

    cursor.close()
    conexao.close()

    return caes


def listar_hospedagens():
    conexao = conectar()
    cursor = conexao.cursor(dictionary=True)

    cursor.execute("SELECT * FROM hospedagem")
    hospedagens = cursor.fetchall()

    cursor.close()
    conexao.close()

    return hospedagens