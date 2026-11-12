
from flask import Flask, request, jsonify, send_from_directory
from pathlib import Path
from mysql.connector import IntegrityError

from backend.tutor import Tutor
from backend.cao import Cao
from backend.hospedagem import Hospedagem

from backend.dao import (
    cadastrar_tutor,
    listar_tutores,
    editar_tutor,
    excluir_tutor,
    cadastrar_cao,
    listar_caes,
    cadastrar_hospedagem,
    listar_hospedagens
)

from backend.database import conectar


BASE_DIR = Path(__file__).resolve().parent.parent

app = Flask(
    __name__,
    static_folder=str(BASE_DIR / "front-end"),
    static_url_path="/front-end"
)


@app.route("/")
def inicio():
    return send_from_directory(BASE_DIR, "index.html")


# ROTAS DE TUTORES

@app.route("/tutores", methods=["GET"])
def consultar_tutores():
    return jsonify(listar_tutores())


@app.route("/tutores", methods=["POST"])
def adicionar_tutor():
    dados = request.get_json()

    tutor = Tutor(
        dados["nome"],
        dados["telefone"],
        dados.get("email"),
        dados.get("morada")
    )

    cadastrar_tutor(tutor)

    return jsonify({"mensagem": "Tutor cadastrado!"}), 201


@app.route("/tutores/<int:id_tutor>", methods=["PUT"])
def atualizar_tutor(id_tutor):
    dados = request.get_json()

    tutor = Tutor(
        dados["nome"],
        dados["telefone"],
        dados.get("email"),
        dados.get("morada")
    )

    atualizado = editar_tutor(id_tutor, tutor)

    if not atualizado:
        return jsonify({"erro": "Tutor não encontrado!"}), 404

    return jsonify({"mensagem": "Tutor atualizado com sucesso!"})


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


# ROTAS DE CÃES

@app.route("/caes", methods=["GET"])
def consultar_caes():
    return jsonify(listar_caes())


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

    return jsonify({"mensagem": "Cao cadastrado!"}), 201


# ROTAS DE HOSPEDAGENS

@app.route("/hospedagens", methods=["GET"])
def consultar_hospedagens():
    return jsonify(listar_hospedagens())


@app.route("/hospedagens", methods=["POST"])
def adicionar_hospedagem():
    dados = request.get_json()

    hospedagem = Hospedagem(
        dados["cao_id"],
        dados["peso_registrado"],
        dados["data_entrada"],
        dados.get("data_saida")
    )

    cadastrar_hospedagem(hospedagem)

    return jsonify({"mensagem": "Hospedagem cadastrada!"}), 201


if __name__ == "__main__":
    try:
        conexao = conectar()
        conexao.close()

        print("Banco de dados conectado!")
        app.run(debug=True)

    except Exception as erro:
        print("Erro ao conectar:", erro)