class Tutor:
    def __init__(self, nome, telefone, email=None, morada=None, id=None):
        self.id = id
        self.nome = nome
        self.telefone = telefone
        self.email = email
        self.morada = morada

    def to_dict(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "telefone": self.telefone,
            "email": self.email,
            "morada": self.morada
        }