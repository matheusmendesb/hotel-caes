from backend.tutor import Tutor
from backend.dao import cadastrar_tutor

tutor = Tutor(
    "Carlos",
    "19999999999",
    "carlos@email.com",
    "Hortolandia"
)

cadastrar_tutor(tutor)

print("Tutor cadastrado com sucesso!")