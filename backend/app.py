
# Importa os recursos necessários do Flask.
from flask import Flask, request, jsonify, send_from_directory

# Permite trabalhar com caminhos de arquivos e pastas.
from pathlib import Path

# Permite converter e comparar datas e horários.
from datetime import datetime

# Importa a exceção gerada pelo MySQL.
from mysql.connector import IntegrityError

# Importa as classes das entidades do sistema.
from backend.tutor import Tutor
from backend.cao import Cao
from backend.hospedagem import Hospedagem

# Importa as funções de acesso ao banco de dados.
from backend.dao import (
    cadastrar_tutor,
    listar_tutores,
    editar_tutor,
    excluir_tutor,
    cadastrar_cao,
    listar_caes,
    editar_cao,
    excluir_cao,
    cadastrar_hospedagem,
    listar_hospedagens,
    editar_hospedagem,
    excluir_hospedagem
)

# Importa a função de conexão com o MySQL.
from backend.database import conectar


# Define o caminho da pasta principal do projeto.
BASE_DIR = Path(__file__).resolve().parent.parent

# Cria a aplicação Flask.
app = Flask(__name__, static_folder=None)


# ==========================================================
# ARQUIVOS DO SISTEMA
# ==========================================================

# Abre o arquivo principal do sistema.
@app.route("/")
def inicio():
    return send_from_directory(BASE_DIR, "index.html")


# Disponibiliza os arquivos CSS.
@app.route("/css/<path:arquivo>")
def arquivos_css(arquivo):
    return send_from_directory(BASE_DIR / "css", arquivo)


# Disponibiliza os arquivos JavaScript.
@app.route("/js/<path:arquivo>")
def arquivos_js(arquivo):
    return send_from_directory(BASE_DIR / "js", arquivo)


# ==========================================================
# ROTAS DE TUTORES
# ==========================================================

# GET: consulta todos os tutores.
@app.route("/tutores", methods=["GET"])
def consultar_tutores():
    return jsonify(listar_tutores())


# POST: cadastra um tutor.
@app.route("/tutores", methods=["POST"])
def adicionar_tutor():
    dados = request.get_json()

    tutor = Tutor(
        dados["nome"],
        dados["telefone"],
        dados.get("email"),
        dados.get("endereco")
    )

    cadastrar_tutor(tutor)

    return jsonify({"mensagem": "Tutor cadastrado!"}), 201


# PUT: atualiza um tutor.
@app.route("/tutores/<int:id_tutor>", methods=["PUT"])
def atualizar_tutor(id_tutor):
    dados = request.get_json()

    tutor = Tutor(
        dados["nome"],
        dados["telefone"],
        dados.get("email"),
        dados.get("endereco")
    )

    atualizado = editar_tutor(id_tutor, tutor)

    if not atualizado:
        return jsonify({"erro": "Tutor não encontrado!"}), 404

    return jsonify({"mensagem": "Tutor atualizado com sucesso!"})


# DELETE: exclui um tutor.
@app.route("/tutores/<int:id_tutor>", methods=["DELETE"])
def remover_tutor(id_tutor):
    try:
        excluido = excluir_tutor(id_tutor)

        if not excluido:
            return jsonify({"erro": "Tutor não encontrado!"}), 404

        return jsonify({"mensagem": "Tutor excluído com sucesso!"})

    except IntegrityError:
        return jsonify({
            "erro": "Não é possível excluir este tutor porque existem cães vinculados a ele."
        }), 409


# ==========================================================
# ROTAS DE CÃES
# ==========================================================

# GET: consulta todos os cães.
@app.route("/caes", methods=["GET"])
def consultar_caes():
    return jsonify(listar_caes())


# POST: cadastra um cão.
@app.route("/caes", methods=["POST"])
def adicionar_cao():
    dados = request.get_json()

    cao = Cao(
        dados["nome"],
        dados["raca"],
        dados["sexo"],
        dados["peso_atual"],
        dados["porte"],
        dados["idade"],
        dados["castrado"],
        dados.get("observacoes"),
        dados["tutor_id"]
    )

    cadastrar_cao(cao)

    return jsonify({"mensagem": "Cão cadastrado!"}), 201


# PUT: atualiza um cão.
@app.route("/caes/<int:id_cao>", methods=["PUT"])
def atualizar_cao(id_cao):
    dados = request.get_json()

    cao = Cao(
        dados["nome"],
        dados["raca"],
        dados["sexo"],
        dados["peso_atual"],
        dados["porte"],
        dados["idade"],
        dados["castrado"],
        dados.get("observacoes"),
        dados["tutor_id"]
    )

    atualizado = editar_cao(id_cao, cao)

    if not atualizado:
        return jsonify({"erro": "Cão não encontrado!"}), 404

    return jsonify({"mensagem": "Cão atualizado com sucesso!"})


# DELETE: exclui um cão.
@app.route("/caes/<int:id_cao>", methods=["DELETE"])
def remover_cao(id_cao):
    try:
        excluido = excluir_cao(id_cao)

        if not excluido:
            return jsonify({"erro": "Cão não encontrado!"}), 404

        return jsonify({"mensagem": "Cão excluído com sucesso!"})

    except IntegrityError:
        return jsonify({
            "erro": "Não é possível excluir este cão porque existem hospedagens vinculadas a ele."
        }), 409


# ==========================================================
# FUNÇÕES AUXILIARES DE HOSPEDAGEM
# ==========================================================

# Converte os dados de uma hospedagem para JSON.
def formatar_hospedagem(hospedagem):
    return {
        "id_hospedagem": hospedagem["id_hospedagem"],
        "cao_id": hospedagem["cao_id"],
        "peso_registrado": float(hospedagem["peso_registrado"]),

        "data_entrada": hospedagem["data_entrada"].isoformat(
            sep="T",
            timespec="seconds"
        ),

        "data_saida": (
            hospedagem["data_saida"].isoformat(
                sep="T",
                timespec="seconds"
            )
            if hospedagem["data_saida"] else None
        )
    }


# Cria um objeto Hospedagem e valida seus dados.
def criar_objeto_hospedagem(dados):
    cao_id = int(dados["cao_id"])
    peso_registrado = float(dados["peso_registrado"])

    data_entrada = datetime.fromisoformat(dados["data_entrada"])

    data_saida_texto = dados.get("data_saida")

    data_saida = (
        datetime.fromisoformat(data_saida_texto)
        if data_saida_texto
        else None
    )

    if peso_registrado <= 0:
        raise ValueError("O peso registrado deve ser maior que zero.")

    if data_saida and data_saida < data_entrada:
        raise ValueError(
            "A data e horário de saída não podem ser anteriores à entrada."
        )

    return Hospedagem(
        cao_id,
        peso_registrado,
        data_entrada,
        data_saida
    )


# ==========================================================
# ROTAS DE HOSPEDAGENS
# ==========================================================

# GET: consulta todas as hospedagens.
@app.route("/hospedagens", methods=["GET"])
def consultar_hospedagens():
    hospedagens = listar_hospedagens()

    return jsonify([
        formatar_hospedagem(hospedagem)
        for hospedagem in hospedagens
    ])


# POST: cadastra uma hospedagem.
@app.route("/hospedagens", methods=["POST"])
def adicionar_hospedagem():
    dados = request.get_json()

    try:
        hospedagem = criar_objeto_hospedagem(dados)
        cadastrar_hospedagem(hospedagem)

        return jsonify({
            "mensagem": "Hospedagem cadastrada com sucesso!"
        }), 201

    except (KeyError, TypeError, ValueError):
        return jsonify({
            "erro": "Preencha corretamente o cão, o peso e a data e horário de entrada."
        }), 400

    except IntegrityError:
        return jsonify({
            "erro": "Não foi possível cadastrar a hospedagem. Verifique se o cão existe e se as datas são válidas."
        }), 400


# PUT: atualiza uma hospedagem.
@app.route("/hospedagens/<int:id_hospedagem>", methods=["PUT"])
def atualizar_hospedagem(id_hospedagem):
    dados = request.get_json()

    try:
        hospedagem = criar_objeto_hospedagem(dados)

        atualizado = editar_hospedagem(id_hospedagem, hospedagem)

        if not atualizado:
            return jsonify({"erro": "Hospedagem não encontrada!"}), 404

        return jsonify({
            "mensagem": "Hospedagem atualizada com sucesso!"
        })

    except (KeyError, TypeError, ValueError):
        return jsonify({
            "erro": "Verifique o cão, o peso e as datas e horários informados."
        }), 400

    except IntegrityError:
        return jsonify({
            "erro": "Não foi possível atualizar a hospedagem. Verifique se o cão existe e se as datas são válidas."
        }), 400


# DELETE: exclui uma hospedagem.
@app.route("/hospedagens/<int:id_hospedagem>", methods=["DELETE"])
def remover_hospedagem(id_hospedagem):
    excluido = excluir_hospedagem(id_hospedagem)

    if not excluido:
        return jsonify({
            "erro": "Hospedagem não encontrada!"
        }), 404

    return jsonify({
        "mensagem": "Hospedagem excluída com sucesso!"
    })


# ==========================================================
# INICIALIZAÇÃO DO SISTEMA
# ==========================================================

if __name__ == "__main__":
    try:
        conexao = conectar()
        conexao.close()

        print("Banco de dados conectado!")

        app.run(debug=True)

    except Exception as erro:w
        print("Erro ao conectar:", erro)
