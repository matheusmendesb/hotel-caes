from database import conectar

try:
    conexao = conectar()
    print("Conexao com o banco realizada com sucesso!")
    conexao.close()

except Exception as erro:
    print("Erro ao conectar:", erro)