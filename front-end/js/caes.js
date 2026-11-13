
// Armazena os tutores e cães recebidos do backend.
let tutoresCadastrados = [];
let caesCadastrados = [];


// Carrega os tutores no campo de seleção.
export async function carregarTutoresNoSelect() {
    try {
        const resposta = await fetch("/tutores");

        if (!resposta.ok) {
            throw new Error("Erro ao carregar tutores.");
        }

        tutoresCadastrados = await resposta.json();

        const select = document.querySelector("#tutor-cao");
        select.innerHTML = '<option value="">Selecione um tutor</option>';

        tutoresCadastrados.forEach(tutor => {
            select.innerHTML += `
                <option value="${tutor.id_tutor}">${tutor.nome}</option>
            `;
        });

    } catch (erro) {
        console.error(erro);
    }
}


// Lista os cães cadastrados na tabela.
export async function listarCaes() {
    try {
        const [respostaCaes, respostaTutores] = await Promise.all([
            fetch("/caes"),
            fetch("/tutores")
        ]);

        if (!respostaCaes.ok || !respostaTutores.ok) {
            throw new Error("Erro ao consultar os cadastros.");
        }

        caesCadastrados = await respostaCaes.json();
        tutoresCadastrados = await respostaTutores.json();

        const tabela = document.querySelector("#lista-caes");

        if (caesCadastrados.length === 0) {
            tabela.innerHTML = `
                <tr>
                    <td colspan="11">Nenhum cão cadastrado.</td>
                </tr>
            `;
            return;
        }

        tabela.innerHTML = caesCadastrados.map(cao => {
            const tutor = tutoresCadastrados.find(
                item => Number(item.id_tutor) === Number(cao.tutor_id)
            );

            return `
                <tr>
                    <td>${cao.id_cao}</td>
                    <td>${cao.nome}</td>
                    <td>${cao.raca}</td>
                    <td>${cao.sexo}</td>
                    <td>${cao.peso_atual ?? "-"}</td>
                    <td>${cao.porte}</td>
                    <td>${cao.idade}</td>
                    <td>${cao.castrado ? "Sim" : "Não"}</td>
                    <td>${cao.observacoes || "-"}</td>
                    <td>${tutor ? tutor.nome : "Não encontrado"}</td>
                    <td>
                        <button type="button" class="btn-acao btn-editar"
                            onclick="editarCao(${cao.id_cao})">
                            Editar
                        </button>

                        <button type="button" class="btn-acao btn-excluir"
                            onclick="excluirCao(${cao.id_cao})">
                            Excluir
                        </button>
                    </td>
                </tr>
            `;
        }).join("");

    } catch (erro) {
        document.querySelector("#lista-caes").innerHTML = `
            <tr>
                <td colspan="11">Erro ao carregar cães.</td>
            </tr>
        `;
        console.error(erro);
    }
}


// Cadastra um cão ou atualiza um cadastro existente.
export async function salvarCao(event) {
    event.preventDefault();

    const id = document.querySelector("#id-cao").value;

    const dados = {
        nome: document.querySelector("#nome-cao").value,
        raca: document.querySelector("#raca-cao").value,
        sexo: document.querySelector("#sexo-cao").value,
        peso_atual: document.querySelector("#peso-cao").value,
        porte: document.querySelector("#porte-cao").value,
        idade: document.querySelector("#idade-cao").value,
        castrado: document.querySelector("#castrado-cao").value,
        observacoes: document.querySelector("#observacoes-cao").value,
        tutor_id: document.querySelector("#tutor-cao").value
    };

    const mensagem = document.querySelector("#mensagem-cao");

    try {
        const resposta = await fetch(
            id ? `/caes/${id}` : "/caes",
            {
                method: id ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dados)
            }
        );

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(resultado.erro || "Erro ao salvar cão.");
        }

        mensagem.textContent = resultado.mensagem || "Cão salvo com sucesso.";

        cancelarEdicaoCao();
        await listarCaes();

    } catch (erro) {
        mensagem.textContent = erro.message;
    }
}


// Preenche o formulário com os dados do cão selecionado.
export function editarCao(idCao) {
    const cao = caesCadastrados.find(
        item => Number(item.id_cao) === Number(idCao)
    );

    if (!cao) return;

    document.querySelector("#id-cao").value = cao.id_cao;
    document.querySelector("#nome-cao").value = cao.nome;
    document.querySelector("#raca-cao").value = cao.raca;
    document.querySelector("#sexo-cao").value = cao.sexo;
    document.querySelector("#peso-cao").value = cao.peso_atual;
    document.querySelector("#porte-cao").value = cao.porte;
    document.querySelector("#idade-cao").value = cao.idade;
    document.querySelector("#castrado-cao").value = String(cao.castrado);
    document.querySelector("#observacoes-cao").value = cao.observacoes || "";
    document.querySelector("#tutor-cao").value = cao.tutor_id;

    document.querySelector("#titulo-form-cao").textContent = "Editar cão";
    document.querySelector("#botao-salvar-cao").textContent = "Salvar alterações";
    document.querySelector("#botao-cancelar-cao").hidden = false;

    document.querySelector("#form-cao").scrollIntoView({
        behavior: "smooth"
    });
}


// Limpa o formulário e encerra a edição.
export function cancelarEdicaoCao() {
    document.querySelector("#form-cao").reset();
    document.querySelector("#id-cao").value = "";

    document.querySelector("#titulo-form-cao").textContent = "Cadastrar cão";
    document.querySelector("#botao-salvar-cao").textContent = "Cadastrar cão";
    document.querySelector("#botao-cancelar-cao").hidden = true;
}


// Exclui um cão após a confirmação.
export async function excluirCao(idCao) {
    if (!confirm("Deseja realmente excluir este cão?")) return;

    try {
        const resposta = await fetch(`/caes/${idCao}`, {
            method: "DELETE"
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(resultado.erro || "Erro ao excluir cão.");
        }

        alert(resultado.mensagem || "Cão excluído com sucesso.");

        if (document.querySelector("#id-cao").value == idCao) {
            cancelarEdicaoCao();
        }

        await listarCaes();

    } catch (erro) {
        alert(erro.message);
    }
}