from flask import Flask
from backend.database import conectar

app = Flask(__name__)

@app.route("/")
def inicio():
    return "Sistema Hotel para Caes funcionando!"

if __name__ == "__main__":
    try:
        conexao = conectar()
        print("Conexao com o banco realizada com sucesso!")
        conexao.close()

        app.run(debug=True)

    except Exception as erro:
        print("Erro ao conectar:", erro)