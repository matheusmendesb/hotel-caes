from backend.cao import Cao
from backend.dao import cadastrar_cao

cao = Cao(
    "Rex",
    "Pastor Alemão",
    "Macho",
    32.5,
    "Grande",
    3,
    True,
    "Cão de teste",
    1
)

cadastrar_cao(cao)

print("Cão cadastrado com sucesso!")