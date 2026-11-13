# Classe que representa um tutor responsável por um ou mais cães.
class Tutor:

    # Recebe e armazena os dados do tutor.
    def __init__(self, nome, telefone, email, morada):
        self.nome = nome
        self.telefone = telefone
        self.email = email
        self.morada = morada
