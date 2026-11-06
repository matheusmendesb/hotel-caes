class Usuario:
    def __init__(self, nome, email, senha, nivel, id=None):
        self.id = id
        self.nome = nome
        self.email = email
        self.senha = senha
        self.nivel = nivel

    def to_dict(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "email": self.email,
            "nivel": self.nivel
        }