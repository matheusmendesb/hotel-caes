
# Classe que representa um cão cadastrado no hotel.
class Cao:

    # Recebe os dados do cão e os armazena no objeto.
    def __init__(
        self,
        nome,
        raca,
        sexo,
        peso_atual,
        porte,
        idade,
        castrado,
        observacoes,
        tutor_id
    ):
        self.nome = nome
        self.raca = raca
        self.sexo = sexo
        self.peso_atual = peso_atual
        self.porte = porte
        self.idade = int(idade)
        self.castrado = 1 if str(castrado).lower() in ("true", "1", "sim") else 0
        self.observacoes = observacoes
        self.tutor_id = tutor_id
