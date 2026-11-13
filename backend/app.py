
# Importa os recursos necessários do Flask para criar rotas,
# receber dados enviados pelo frontend e servir arquivos.
from flask import Flask, request, jsonify, send_from_directory

# Permite trabalhar com caminhos de arquivos e pastas.
from pathlib import Path

# Permite converter e comparar datas e horários.
from datetime import datetime

# Importa a exceção gerada pelo MySQL quando uma operação
# viola uma restrição do banco, como uma chave estrangeira.
from mysql.connector import IntegrityError

# Importa as classes que representam as entidades do sistema.
from backend.tutor import Tutor
from backend.cao import Cao
from backend.hospedagem import Hospedagem

# Importa as funções responsáveis pelas operações no banco de dados.
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

# Importa a função que cria a conexão com o MySQL.
from backend.database import conectar


# Define o caminho da pasta principal do projeto.
BASE_DIR = Path(__file__).resolve().parent.parent

# Cria a aplicação Flask e configura a pasta dos arquivos estáticos,
# como CSS e JavaScript.
app = Flask(
    __name__,
    static_folder=str(BASE_DIR / "front-end"),
    static_url_path="/front-end"
)


# ROTA PRINCIPAL
# Abre o arquivo index.html quando o usuário acessa a página inicial.
@app.route("/")
def inicio():
    return send_from_directory(BASE_DIR, "index.html")


# ==========================================================
# ROTAS DE TUTORES
# ==========================================================

# GET: consulta todos os tutores cadastrados.
@app.route("/tutores", methods=["GET"])
def consultar_tutores():
    return jsonify(listar_tutores())


# POST: recebe os dados do formulário e cadastra um tutor.
@app.route("/tutores", methods=["POST"])
def adicionar_tutor():
    dados = request.get_json()

    # O frontend envia o endereço, mas a classe Tutor
    # ainda utiliza o nome morada internamente.
    tutor = Tutor(
        dados["nome"],
        dados["telefone"],
        dados.get("email"),
        dados.get("endereco")
    )

    cadastrar_tutor(tutor)

    return jsonify({"mensagem": "Tutor cadastrado!"}), 201


# PUT: atualiza os dados de um tutor específico.
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


# DELETE: exclui um tutor pelo seu ID.
@app.route("/tutores/<int:id_tutor>", methods=["DELETE"])
def remover_tutor(id_tutor):
    try:
        excluido = excluir_tutor(id_tutor)

        if not excluido:
            return jsonify({"erro": "Tutor não encontrado!"}), 404

        return jsonify({"mensagem": "Tutor excluído com sucesso!"})

    # Impede a exclusão quando existem cães vinculados ao tutor.
    except IntegrityError:
        return jsonify({
            "erro": "Não é possível excluir este tutor porque existem cães vinculados a ele."
        }), 409


# ==========================================================
# ROTAS DE CÃES
# ==========================================================

# GET: consulta todos os cães cadastrados.
@app.route("/caes", methods=["GET"])
def consultar_caes():
    return jsonify(listar_caes())


# POST: recebe os dados do formulário e cadastra um cão.
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


# PUT: atualiza os dados de um cão específico.
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


# DELETE: exclui um cão pelo seu ID.
@app.route("/caes/<int:id_cao>", methods=["DELETE"])
def remover_cao(id_cao):
    try:
        excluido = excluir_cao(id_cao)

        if not excluido:
            return jsonify({"erro": "Cão não encontrado!"}), 404

        return jsonify({"mensagem": "Cão excluído com sucesso!"})

    # Impede a exclusão quando existem hospedagens vinculadas ao cão.
    except IntegrityError:
        return jsonify({
            "erro": "Não é possível excluir este cão porque existem hospedagens vinculadas a ele."
        }), 409


# ==========================================================
# FUNÇÕES AUXILIARES DE HOSPEDAGEM
# ==========================================================

# Converte os dados de uma hospedagem para um formato JSON.
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


# Cria um objeto Hospedagem a partir dos dados recebidos.
# Também valida o peso e a ordem das datas.
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


# POST: cadastra uma nova hospedagem.
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


# PUT: atualiza uma hospedagem existente.
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


# DELETE: exclui uma hospedagem pelo seu ID.
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

    except Exception as erro:
        print("Erro ao conectar:", erro)