from flask import Flask, request, jsonify

from backend.tutor import Tutor
from backend.cao import Cao
from backend.hospedagem import Hospedagem

from backend.dao import (
    cadastrar_tutor,
    listar_tutores,
    cadastrar_cao,
    listar_caes,
    cadastrar_hospedagem,
    listar_hospedagens
)

app = Flask(__name__)


@app.route("/")
def inicio():
    return "Sistema Hotel para Caes funcionando!"


@app.route("/tutores", methods=["GET"])
def consultar_tutores():
    return jsonify(listar_tutores())


@app.route("/tutores", methods=["POST"])
def adicionar_tutor():
    dados = request.get_json()

    tutor = Tutor(
        dados["nome"],
        dados["telefone"],
        dados["email"],
        dados["morada"]
    )

    cadastrar_tutor(tutor)

    return jsonify({"mensagem": "Tutor cadastrado!"}), 201


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
        dados["observacoes"],
        dados["tutor_id"]
    )

    cadastrar_cao(cao)

    return jsonify({"mensagem": "Cao cadastrado!"}), 201


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
    app.run(debug=True)
