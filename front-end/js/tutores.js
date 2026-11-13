// Armazena temporariamente os tutores recebidos do backend.
let tutoresCadastrados = [];


// ==========================================================
// LISTAR TUTORES
// ==========================================================

// Consulta os tutores e apresenta os dados na tabela.
export async function listarTutores() {
    const tabela = document.querySelector("#lista-tutores");

    try {
        const resposta = await fetch("/tutores");

        if (!resposta.ok) {
            throw new Error("Erro ao consultar tutores.");
        }

        tutoresCadastrados = await resposta.json();
        tabela.innerHTML = "";

        // Informa quando ainda não existem tutores cadastrados.
        if (tutoresCadastrados.length === 0) {
            tabela.innerHTML = `
                <tr>
                    <td colspan="6">Nenhum tutor cadastrado.</td>
                </tr>
            `;
            return;
        }

        // Cria uma linha na tabela para cada tutor.
        tutoresCadastrados.forEach(tutor => {
            tabela.innerHTML += `
                <tr>
                    <td>${tutor.id_tutor}</td>
                    <td>${tutor.nome}</td>
                    <td>${tutor.telefone}</td>
                    <td>${tutor.email || "-"}</td>
                    <td>${tutor.morada || "-"}</td>
                    <td>
                        <button
                            type="button"
                            class="btn-acao btn-editar"
                            onclick="editarTutor(${tutor.id_tutor})"
                        >
                            Editar
                        </button>

                        <button
                            type="button"
                            class="btn-acao btn-excluir"
                            onclick="excluirTutor(${tutor.id_tutor})"
                        >
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


// ==========================================================
// CADASTRAR OU ATUALIZAR TUTOR
// ==========================================================

// Envia os dados do formulário para cadastrar ou atualizar um tutor.
export async function salvarTutor(event) {
    event.preventDefault();

    const idTutor = document.querySelector("#id-tutor").value;

    // Reúne os valores preenchidos no formulário.
    const tutor = {
        nome: document.querySelector("#nome").value,
        telefone: document.querySelector("#telefone").value,
        email: document.querySelector("#email").value,
        morada: document.querySelector("#morada").value
    };

    const mensagem = document.querySelector("#mensagem-tutor");

    try {
        // Se existe ID, atualiza; caso contrário, cadastra.
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

        // Limpa o formulário e encerra o modo de edição.
        document.querySelector("#form-tutor").reset();
        cancelarEdicao();

        // Atualiza a tabela com os dados mais recentes.
        await listarTutores();

    } catch (erro) {
        mensagem.textContent = erro.message;
    }
}


// ==========================================================
// EDITAR TUTOR
// ==========================================================

// Preenche o formulário com os dados do tutor selecionado.
export function editarTutor(idTutor) {
    const tutor = tutoresCadastrados.find(
        item => Number(item.id_tutor) === Number(idTutor)
    );

    if (!tutor) return;

    document.querySelector("#id-tutor").value = tutor.id_tutor;
    document.querySelector("#nome").value = tutor.nome;
    document.querySelector("#telefone").value = tutor.telefone;
    document.querySelector("#email").value = tutor.email || "";
    document.querySelector("#morada").value = tutor.morada || "";

    // Altera os textos e exibe o botão de cancelar.
    document.querySelector("#titulo-formulario").textContent = "Editar tutor";
    document.querySelector("#botao-cadastrar").textContent = "Salvar alterações";
    document.querySelector("#botao-cancelar").hidden = false;
    document.querySelector("#mensagem-tutor").textContent = "";

    // Leva o usuário até o formulário.
    document.querySelector("#form-tutor").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


// ==========================================================
// CANCELAR EDIÇÃO
// ==========================================================

// Limpa os campos e restaura o formulário para cadastro.
export function cancelarEdicao() {
    document.querySelector("#form-tutor").reset();
    document.querySelector("#id-tutor").value = "";

    document.querySelector("#titulo-formulario").textContent = "Cadastrar tutor";
    document.querySelector("#botao-cadastrar").textContent = "Cadastrar tutor";
    document.querySelector("#botao-cancelar").hidden = true;
}


// ==========================================================
// EXCLUIR TUTOR
// ==========================================================

// Exclui um tutor após confirmação do usuário.
export async function excluirTutor(idTutor) {
    const confirmar = confirm(
        `Tem certeza que deseja excluir o tutor de ID ${idTutor}?`
    );

    if (!confirmar) return;

    try {
        const resposta = await fetch(`/tutores/${idTutor}`, {
            method: "DELETE"
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(resultado.erro || "Erro ao excluir tutor.");
        }

        document.querySelector("#mensagem-tutor").textContent =
            resultado.mensagem;

        // Atualiza a tabela após a exclusão.
        await listarTutores();

    } catch (erro) {
        document.querySelector("#mensagem-tutor").textContent = erro.message;
    }
}