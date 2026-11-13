# Classe que representa uma hospedagem de um cão no hotel.
class Hospedagem:

    # Recebe os dados necessários para registrar a hospedagem.
    def __init__(self, cao_id, peso_registrado, data_entrada, data_saida):
        self.cao_id = cao_id
        self.peso_registrado = peso_registrado
        self.data_entrada = data_entrada
        self.data_saida = data_saida