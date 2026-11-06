class Cao:
    def __init__(self, nome, raca, sexo, peso, porte, idade, castrado, observacoes, data_entrada, data_saida=None, tutor_id=None, id=None):
        self.id = id
        self.nome = nome
        self.raca = raca
        self.sexo = sexo
        self.peso = peso
        self.porte = porte
        self.idade = idade
        self.castrado = castrado
        self.observacoes = observacoes
        self.data_entrada = data_entrada
        self.data_saida = data_saida
        self.tutor_id = tutor_id

    def to_dict(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "raca": self.raca,
            "sexo": self.sexo,
            "peso": self.peso,
            "porte": self.porte,
            "idade": self.idade,
            "castrado": self.castrado,
            "observacoes": self.observacoes,
            "data_entrada": self.data_entrada,
            "data_saida": self.data_saida,
            "tutor_id": self.tutor_id
        }