from flask import Flask, request, jsonify
from backend.database import conectar
from backend.tutor import Tutor
from backend.cao import Cao
from backend.dao import (
    cadastrar_tutor,
    listar_tutores,
    cadastrar_cao,
    listar_caes
)

app = Flask(__name__)


@app.route("/")
def inicio():
    return "Sistema Hotel para Caes funcionando!"


@app.route("/tutores", methods=["GET"])
def consultar_tutores():
    tutores = listar_tutores()
    return jsonify(tutores)


@app.route("/tutores", methods=["POST"])
def criar_tutor():
    dados = request.get_json()

    tutor = Tutor(
        dados["nome"],
        dados["telefone"],
        dados.get("email"),
        dados.get("morada")
    )

    cadastrar_tutor(tutor)

    return jsonify({"mensagem": "Tutor cadastrado com sucesso!"}), 201


@app.route("/caes", methods=["GET"])
def consultar_caes():
    caes = listar_caes()
    return jsonify(caes)


@app.route("/caes", methods=["POST"])
def criar_cao():
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

    return jsonify({"mensagem": "Cao cadastrado com sucesso!"}), 201


if __name__ == "__main__":
    try:
        conexao = conectar()
        conexao.close()

        app.run(debug=True)

    except Exception as erro:
        print("Erro ao conectar:", erro)