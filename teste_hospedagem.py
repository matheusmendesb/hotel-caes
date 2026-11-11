from backend.hospedagem import Hospedagem
from backend.dao import cadastrar_hospedagem

hospedagem = Hospedagem(
    1,
    32.5,
    "2026-11-11",
    "2026-11-15"
)

cadastrar_hospedagem(hospedagem)

print("Hospedagem cadastrada com sucesso!")