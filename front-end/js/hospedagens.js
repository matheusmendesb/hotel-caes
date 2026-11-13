// Armazena os cães e as hospedagens recebidos do backend.
let caesCadastrados = [];
let hospedagensCadastradas = [];


// ==========================================================
// CARREGAR CÃES NO SELECT
// ==========================================================

// Busca os cães cadastrados e preenche o campo de seleção.
export async function carregarCaesNoSelect() {
    const select = document.querySelector("#cao-hospedagem");

    try {
        const resposta = await fetch("/caes");

        if (!resposta.ok) {
            throw new Error("Erro ao consultar cães.");
        }

        caesCadastrados = await resposta.json();

        select.innerHTML = '<option value="">Selecione o cão</option>';

        // Cria uma opção para cada cão cadastrado.
        caesCadastrados.forEach(cao => {
            select.innerHTML += `
                <option value="${cao.id_cao}">
                    ${escaparHTML(cao.nome)} (ID ${cao.id_cao})
                </option>
            `;
        });

        if (caesCadastrados.length === 0) {
            select.innerHTML = '<option value="">Cadastre um cão primeiro</option>';
        }

    } catch (erro) {
        select.innerHTML = '<option value="">Erro ao carregar cães</option>';
        console.error(erro);
    }
}


// ==========================================================
// LISTAR HOSPEDAGENS
// ==========================================================

// Consulta as hospedagens e os cães para montar a tabela.
export async function listarHospedagens() {
    const tabela = document.querySelector("#lista-hospedagens");

    try {
        const [resHospedagens, resCaes] = await Promise.all([
            fetch("/hospedagens"),
            fetch("/caes")
        ]);

        if (!resHospedagens.ok || !resCaes.ok) {
            throw new Error("Erro ao consultar hospedagens ou cães.");
        }

        hospedagensCadastradas = await resHospedagens.json();
        caesCadastrados = await resCaes.json();

        tabela.innerHTML = "";

        // Exibe uma mensagem quando não existem hospedagens.
        if (hospedagensCadastradas.length === 0) {
            tabela.innerHTML = `
                <tr>
                    <td colspan="7">Nenhuma hospedagem cadastrada.</td>
                </tr>
            `;
            return;
        }

        // Percorre as hospedagens para montar cada linha da tabela.
        hospedagensCadastradas.forEach(hospedagem => {
            const cao = caesCadastrados.find(
                item => Number(item.id_cao) === Number(hospedagem.cao_id)
            );

            const entrada = formatarDataHora(hospedagem.data_entrada);

            const saida = hospedagem.data_saida
                ? formatarDataHora(hospedagem.data_saida)
                : "-";

            // Verifica se a hospedagem já foi finalizada.
            const dataSaida = hospedagem.data_saida
                ? new Date(hospedagem.data_saida)
                : null;

            const situacao = dataSaida && dataSaida <= new Date()
                ? "Finalizada"
                : "Em andamento";

            tabela.innerHTML += `
                <tr>
                    <td>${hospedagem.id_hospedagem}</td>
                    <td>${cao ? escaparHTML(cao.nome) : "Cão não encontrado"}</td>
                    <td>${Number(hospedagem.peso_registrado).toFixed(2)} kg</td>
                    <td>${entrada}</td>
                    <td>${saida}</td>
                    <td>${situacao}</td>
                    <td>
                        <button
                            type="button"
                            class="btn-acao btn-editar"
                            onclick="editarHospedagem(${hospedagem.id_hospedagem})"
                        >
                            Editar
                        </button>

                        <button
                            type="button"
                            class="btn-acao btn-excluir"
                            onclick="excluirHospedagem(${hospedagem.id_hospedagem})"
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
                <td colspan="7">Erro ao carregar hospedagens.</td>
            </tr>
        `;
        console.error(erro);
    }
}


// ==========================================================
// FORMATAR DATA E HORA
// ==========================================================

// Converte uma data recebida do backend para o formato brasileiro.
function formatarDataHora(valor) {
    if (!valor) return "-";

    const data = new Date(valor);

    // Retorna o valor original se a data for inválida.
    if (Number.isNaN(data.getTime())) {
        return valor;
    }

    return data.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}


// ==========================================================
// ESCAPAR HTML
// ==========================================================

// Substitui caracteres especiais para evitar que nomes sejam
// interpretados como marcação HTML quando inseridos na página.
function escaparHTML(valor) {
    return String(valor).replace(/[&<>"']/g, caractere => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[caractere]);
}


// ==========================================================
// SALVAR OU ATUALIZAR HOSPEDAGEM
// ==========================================================

// Envia os dados para cadastrar uma nova hospedagem
// ou atualizar uma hospedagem já existente.
async function salvarHospedagem(event) {
    event.preventDefault();

    const id = document.querySelector("#id-hospedagem").value;

    const entrada = document.querySelector("#data-entrada").value;
    const saida = document.querySelector("#data-saida").value;

    const mensagem = document.querySelector("#mensagem-hospedagem");

    // Reúne os dados preenchidos no formulário.
    const hospedagem = {
        cao_id: document.querySelector("#cao-hospedagem").value,
        peso_registrado: document.querySelector("#peso-hospedagem").value,
        data_entrada: entrada,
        data_saida: saida || null
    };

    // Impede que a data de saída seja anterior à entrada.
    if (saida && saida < entrada) {
        mensagem.textContent = "A saída não pode ser anterior à entrada.";
        return;
    }

    try {
        // Escolhe a rota e o método de acordo com a operação.
        const resposta = await fetch(
            id ? `/hospedagens/${id}` : "/hospedagens",
            {
                method: id ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(hospedagem)
            }
        );

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(
                resultado.erro || "Não foi possível salvar a hospedagem."
            );
        }

        cancelarEdicaoHospedagem();

        mensagem.textContent = resultado.mensagem;

        // Atualiza a tabela depois de salvar.
        await listarHospedagens();

    } catch (erro) {
        mensagem.textContent = erro.message;
    }
}


// ==========================================================
// EDITAR HOSPEDAGEM
// ==========================================================

// Preenche o formulário com os dados da hospedagem selecionada.
export function editarHospedagem(id) {
    const hospedagem = hospedagensCadastradas.find(
        item => Number(item.id_hospedagem) === Number(id)
    );

    if (!hospedagem) {
        alert("Hospedagem não encontrada.");
        return;
    }

    document.querySelector("#id-hospedagem").value = hospedagem.id_hospedagem;
    document.querySelector("#cao-hospedagem").value = hospedagem.cao_id;
    document.querySelector("#peso-hospedagem").value = hospedagem.peso_registrado;

    // O campo datetime-local utiliza o formato AAAA-MM-DDTHH:MM.
    document.querySelector("#data-entrada").value =
        hospedagem.data_entrada.slice(0, 16);

    document.querySelector("#data-saida").value =
        hospedagem.data_saida
            ? hospedagem.data_saida.slice(0, 16)
            : "";

    // Atualiza os textos do formulário para o modo de edição.
    document.querySelector("#titulo-form-hospedagem").textContent =
        "Editar hospedagem";

    document.querySelector("#botao-salvar-hospedagem").textContent =
        "Salvar alterações";

    document.querySelector("#botao-cancelar-hospedagem").hidden = false;

    document.querySelector("#mensagem-hospedagem").textContent =
        `Editando hospedagem ${id}.`;

    // Leva o usuário até o formulário.
    document.querySelector("#form-hospedagem").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


// ==========================================================
// CANCELAR EDIÇÃO
// ==========================================================

// Limpa o formulário e restaura o modo de cadastro.
export function cancelarEdicaoHospedagem() {
    document.querySelector("#form-hospedagem").reset();

    document.querySelector("#id-hospedagem").value = "";

    document.querySelector("#titulo-form-hospedagem").textContent =
        "Cadastrar hospedagem";

    document.querySelector("#botao-salvar-hospedagem").textContent =
        "Cadastrar hospedagem";

    document.querySelector("#botao-cancelar-hospedagem").hidden = true;

    document.querySelector("#mensagem-hospedagem").textContent = "";
}


// ==========================================================
// EXCLUIR HOSPEDAGEM
// ==========================================================

// Solicita confirmação e exclui a hospedagem selecionada.
export async function excluirHospedagem(id) {
    const confirmar = confirm(
        `Tem certeza que deseja excluir a hospedagem ${id}?`
    );

    if (!confirmar) return;

    const mensagem = document.querySelector("#mensagem-hospedagem");

    try {
        const resposta = await fetch(`/hospedagens/${id}`, {
            method: "DELETE"
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(
                resultado.erro || "Não foi possível excluir a hospedagem."
            );
        }

        // Se a hospedagem excluída estava em edição, limpa o formulário.
        if (
            document.querySelector("#id-hospedagem").value === String(id)
        ) {
            cancelarEdicaoHospedagem();
        }

        mensagem.textContent = resultado.mensagem;

        await listarHospedagens();

    } catch (erro) {
        mensagem.textContent = erro.message;
    }
}


// ==========================================================
// INICIALIZAR HOSPEDAGENS
// ==========================================================

// Carrega os dados iniciais e registra os eventos do formulário.
export function inicializarHospedagens() {
    carregarCaesNoSelect();
    listarHospedagens();

    // Define a função executada quando o formulário é enviado.
    document.querySelector("#form-hospedagem").addEventListener(
        "submit",
        salvarHospedagem
    );

    // Define a função executada ao clicar em cancelar.
    document.querySelector("#botao-cancelar-hospedagem").addEventListener(
        "click",
        cancelarEdicaoHospedagem
    );
}