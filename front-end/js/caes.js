// Guarda os tutores e cães recebidos do backend.
let tutoresCadastrados = [];
let caesCadastrados = [];


// ==========================================================
// CARREGAR TUTORES NO SELECT
// ==========================================================

// Busca os tutores e preenche o campo de seleção do formulário de cães.
export async function carregarTutoresNoSelect() {
    const select = document.querySelector("#tutor-cao");

    try {
        const resposta = await fetch("/tutores");

        if (!resposta.ok) {
            throw new Error("Erro ao consultar tutores.");
        }

        tutoresCadastrados = await resposta.json();

        select.innerHTML = '<option value="">Selecione o tutor</option>';

        // Cria uma opção para cada tutor encontrado.
        tutoresCadastrados.forEach(tutor => {
            select.innerHTML += `
                <option value="${tutor.id_tutor}">
                    ${tutor.nome} (ID ${tutor.id_tutor})
                </option>
            `;
        });

        // Informa quando ainda não existem tutores cadastrados.
        if (tutoresCadastrados.length === 0) {
            select.innerHTML = '<option value="">Cadastre um tutor primeiro</option>';
        }

    } catch (erro) {
        select.innerHTML = '<option value="">Erro ao carregar tutores</option>';
        console.error(erro);
    }
}


// ==========================================================
// LISTAR CÃES
// ==========================================================

// Consulta os cães e tutores e monta a tabela de cães.
export async function listarCaes() {
    const tabela = document.querySelector("#lista-caes");

    try {
        // Faz as duas consultas simultaneamente.
        const [resCaes, resTutores] = await Promise.all([
            fetch("/caes"),
            fetch("/tutores")
        ]);

        if (!resCaes.ok || !resTutores.ok) {
            throw new Error("Erro ao consultar cães ou tutores.");
        }

        caesCadastrados = await resCaes.json();
        tutoresCadastrados = await resTutores.json();

        tabela.innerHTML = "";

        // Exibe uma mensagem quando não há cães cadastrados.
        if (caesCadastrados.length === 0) {
            tabela.innerHTML = `
                <tr>
                    <td colspan="11">Nenhum cão cadastrado.</td>
                </tr>
            `;
            return;
        }

        // Percorre os cães e encontra o tutor responsável por cada um.
        caesCadastrados.forEach(cao => {
            const tutor = tutoresCadastrados.find(
                item => Number(item.id_tutor) === Number(cao.tutor_id)
            );

            tabela.innerHTML += `
                <tr>
                    <td>${cao.id_cao}</td>
                    <td>${cao.nome}</td>
                    <td>${cao.raca}</td>
                    <td>${cao.sexo}</td>
                    <td>${cao.peso_atual} kg</td>
                    <td>${cao.porte}</td>
                    <td>${cao.idade}</td>
                    <td>${cao.castrado ? "Sim" : "Não"}</td>
                    <td>${cao.observacoes || "-"}</td>
                    <td>${tutor ? tutor.nome : "Tutor não encontrado"}</td>
                    <td>
                        <button
                            type="button"
                            class="btn-acao btn-editar"
                            onclick="editarCao(${cao.id_cao})"
                        >
                            Editar
                        </button>

                        <button
                            type="button"
                            class="btn-acao btn-excluir"
                            onclick="excluirCao(${cao.id_cao})"
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
                <td colspan="11">Erro ao carregar cães.</td>
            </tr>
        `;
        console.error(erro);
    }
}


// ==========================================================
// CADASTRAR CÃO
// ==========================================================

// Função de cadastro mantida caso seja utilizada em outro ponto do projeto.
export async function cadastrarCao(event) {
    event.preventDefault();

    // Reúne os dados preenchidos no formulário.
    const cao = {
        nome: document.querySelector("#nome-cao").value,
        raca: document.querySelector("#raca-cao").value,
        sexo: document.querySelector("#sexo-cao").value,
        peso_atual: document.querySelector("#peso-cao").value,
        porte: document.querySelector("#porte-cao").value,
        idade: document.querySelector("#idade-cao").value,
        castrado: document.querySelector("#castrado-cao").value === "true",
        observacoes: document.querySelector("#observacoes-cao").value,
        tutor_id: document.querySelector("#tutor-cao").value
    };

    const mensagem = document.querySelector("#mensagem-cao");

    try {
        // Envia os dados para a rota de cadastro do backend.
        const resposta = await fetch("/caes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(cao)
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(resultado.erro || "Erro ao cadastrar cão.");
        }

        mensagem.textContent = resultado.mensagem;

        // Limpa o formulário e atualiza a tabela.
        document.querySelector("#form-cao").reset();
        await listarCaes();

    } catch (erro) {
        mensagem.textContent = erro.message;
    }
}


// ==========================================================
// EDITAR CÃO
// ==========================================================

// Preenche o formulário com os dados do cão selecionado.
export async function editarCao(idCao) {
    const cao = caesCadastrados.find(
        item => Number(item.id_cao) === Number(idCao)
    );

    if (!cao) {
        alert("Cão não encontrado.");
        return;
    }

    // Preenche os campos com os dados já cadastrados.
    document.querySelector("#id-cao").value = cao.id_cao;
    document.querySelector("#nome-cao").value = cao.nome;
    document.querySelector("#raca-cao").value = cao.raca;
    document.querySelector("#sexo-cao").value = cao.sexo;
    document.querySelector("#peso-cao").value = cao.peso_atual;
    document.querySelector("#porte-cao").value = cao.porte;
    document.querySelector("#idade-cao").value = cao.idade;
    document.querySelector("#castrado-cao").value = cao.castrado ? "true" : "false";
    document.querySelector("#observacoes-cao").value = cao.observacoes || "";
    document.querySelector("#tutor-cao").value = cao.tutor_id;

    // Altera os textos para indicar que o formulário está em edição.
    document.querySelector("#titulo-form-cao").textContent = "Editar cão";
    document.querySelector("#botao-salvar-cao").textContent = "Salvar alterações";
    document.querySelector("#botao-cancelar-cao").hidden = false;

    document.querySelector("#mensagem-cao").textContent = "";

    // Leva o usuário até o formulário.
    document.querySelector("#form-cao").scrollIntoView({
        behavior: "smooth"
    });
}


// ==========================================================
// SALVAR OU ATUALIZAR CÃO
// ==========================================================

// Decide entre cadastrar um cão novo ou atualizar um existente.
export async function salvarCao(event) {
    event.preventDefault();

    const idCao = document.querySelector("#id-cao").value;

    // Reúne os dados atuais do formulário.
    const cao = {
        nome: document.querySelector("#nome-cao").value,
        raca: document.querySelector("#raca-cao").value,
        sexo: document.querySelector("#sexo-cao").value,
        peso_atual: document.querySelector("#peso-cao").value,
        porte: document.querySelector("#porte-cao").value,
        idade: document.querySelector("#idade-cao").value,
        castrado: document.querySelector("#castrado-cao").value === "true",
        observacoes: document.querySelector("#observacoes-cao").value,
        tutor_id: document.querySelector("#tutor-cao").value
    };

    // Se existe um ID, o formulário está editando um cão.
    const editando = idCao !== "";
    const mensagem = document.querySelector("#mensagem-cao");

    try {
        // Define a rota e o método conforme a operação.
        const resposta = await fetch(
            editando ? `/caes/${idCao}` : "/caes",
            {
                method: editando ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(cao)
            }
        );

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(resultado.erro || "Erro ao salvar cão.");
        }

        mensagem.textContent = resultado.mensagem;

        // Finaliza o modo de edição e atualiza a tabela.
        cancelarEdicaoCao();
        await listarCaes();

    } catch (erro) {
        mensagem.textContent = erro.message;
    }
}


// ==========================================================
// CANCELAR EDIÇÃO DE CÃO
// ==========================================================

// Limpa o formulário e restaura o modo de cadastro.
export function cancelarEdicaoCao() {
    document.querySelector("#form-cao").reset();
    document.querySelector("#id-cao").value = "";

    document.querySelector("#titulo-form-cao").textContent = "Cadastrar cão";
    document.querySelector("#botao-salvar-cao").textContent = "Cadastrar cão";
    document.querySelector("#botao-cancelar-cao").hidden = true;
}


// ==========================================================
// EXCLUIR CÃO
// ==========================================================

// Exclui o cão selecionado após confirmação do usuário.
export async function excluirCao(idCao) {
    const cao = caesCadastrados.find(
        item => Number(item.id_cao) === Number(idCao)
    );

    if (!cao) {
        alert("Cão não encontrado.");
        return;
    }

    // Solicita confirmação antes de excluir o registro.
    if (!confirm(`Deseja realmente excluir o cão ${cao.nome}?`)) {
        return;
    }

    const mensagem = document.querySelector("#mensagem-cao");

    try {
        const resposta = await fetch(`/caes/${idCao}`, {
            method: "DELETE"
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(resultado.erro || "Erro ao excluir cão.");
        }

        mensagem.textContent = resultado.mensagem;

        // Se o cão excluído estava sendo editado, limpa o formulário.
        if (Number(document.querySelector("#id-cao").value) === Number(idCao)) {
            cancelarEdicaoCao();
        }

        await listarCaes();

    } catch (erro) {
        mensagem.textContent = erro.message;
    }
}