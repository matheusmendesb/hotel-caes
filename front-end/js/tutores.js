
// Armazena os tutores recebidos do backend.
let tutoresCadastrados = [];


// Lista os tutores na tabela.
export async function listarTutores() {
    const tabela = document.querySelector("#lista-tutores");

    try {
        const resposta = await fetch("/tutores");

        if (!resposta.ok) {
            throw new Error("Erro ao consultar tutores.");
        }

        tutoresCadastrados = await resposta.json();
        tabela.innerHTML = "";

        if (tutoresCadastrados.length === 0) {
            tabela.innerHTML = `
                <tr>
                    <td colspan="6">Nenhum tutor cadastrado.</td>
                </tr>
            `;
            return;
        }

        tutoresCadastrados.forEach(tutor => {
            tabela.innerHTML += `
                <tr>
                    <td>${tutor.id_tutor}</td>
                    <td>${tutor.nome}</td>
                    <td>${tutor.telefone}</td>
                    <td>${tutor.email || "-"}</td>
                    <td>${tutor.endereco || "-"}</td>
                    <td>
                        <button type="button" class="btn-acao btn-editar"
                            onclick="editarTutor(${tutor.id_tutor})">
                            Editar
                        </button>

                        <button type="button" class="btn-acao btn-excluir"
                            onclick="excluirTutor(${tutor.id_tutor})">
                            Excluir
                        </button>
                    </td>
                </tr>
            `;
        });

    } catch (erro) {
        tabela.innerHTML = `
            <tr>
                <td colspan="6">Erro ao carregar tutores.</td>
            </tr>
        `;
        console.error(erro);
    }
}


// Cadastra um tutor novo ou atualiza um existente.
export async function salvarTutor(event) {
    event.preventDefault();

    const idTutor = document.querySelector("#id-tutor").value;

    const tutor = {
        nome: document.querySelector("#nome").value,
        telefone: document.querySelector("#telefone").value,
        email: document.querySelector("#email").value,
        endereco: document.querySelector("#endereco").value
    };

    const mensagem = document.querySelector("#mensagem-tutor");

    try {
        const resposta = await fetch(
            idTutor ? `/tutores/${idTutor}` : "/tutores",
            {
                method: idTutor ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(tutor)
            }
        );

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(resultado.erro || "Erro ao salvar tutor.");
        }

        mensagem.textContent = resultado.mensagem;

        cancelarEdicao();
        await listarTutores();

    } catch (erro) {
        mensagem.textContent = erro.message;
    }
}


// Coloca os dados do tutor selecionado no formulário.
export function editarTutor(idTutor) {
    const tutor = tutoresCadastrados.find(
        item => Number(item.id_tutor) === Number(idTutor)
    );

    if (!tutor) return;

    document.querySelector("#id-tutor").value = tutor.id_tutor;
    document.querySelector("#nome").value = tutor.nome;
    document.querySelector("#telefone").value = tutor.telefone;
    document.querySelector("#email").value = tutor.email || "";
    document.querySelector("#endereco").value = tutor.endereco || "";

    document.querySelector("#titulo-formulario").textContent = "Editar tutor";
    document.querySelector("#botao-cadastrar").textContent = "Salvar alterações";
    document.querySelector("#botao-cancelar").hidden = false;
    document.querySelector("#mensagem-tutor").textContent = "";

    document.querySelector("#form-tutor").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


// Limpa o formulário e encerra a edição.
export function cancelarEdicao() {
    document.querySelector("#form-tutor").reset();
    document.querySelector("#id-tutor").value = "";

    document.querySelector("#titulo-formulario").textContent = "Cadastrar tutor";
    document.querySelector("#botao-cadastrar").textContent = "Cadastrar tutor";
    document.querySelector("#botao-cancelar").hidden = true;
}


// Exclui um tutor após a confirmação.
export async function excluirTutor(idTutor) {
    if (!confirm(`Tem certeza que deseja excluir o tutor de ID ${idTutor}?`)) {
        return;
    }

    const mensagem = document.querySelector("#mensagem-tutor");

    try {
        const resposta = await fetch(`/tutores/${idTutor}`, {
            method: "DELETE"
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(resultado.erro || "Erro ao excluir tutor.");
        }

        mensagem.textContent = resultado.mensagem;
        await listarTutores();

    } catch (erro) {
        mensagem.textContent = erro.message;
    }
}