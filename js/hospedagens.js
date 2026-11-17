
// Armazena os cães e as hospedagens recebidos do backend.
let caesCadastrados = [];
let hospedagensCadastradas = [];


// Protege textos para evitar interpretação indevida como HTML.
function escaparHTML(valor) {
    return String(valor ?? "").replace(/[&<>"']/g, caractere => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[caractere]);
}


// Exibe mensagens de sucesso ou erro.
function mostrarMensagem(elemento, mensagem, erro = false) {
    elemento.textContent = mensagem;
    elemento.style.color = erro ? "#b42318" : "#26734d";
}


// Carrega os cães cadastrados no campo de seleção.
export async function carregarCaesNoSelect() {
    try {
        const resposta = await fetch("/caes");

        if (!resposta.ok) {
            throw new Error("Erro ao carregar cães.");
        }

        caesCadastrados = await resposta.json();

        const select = document.querySelector("#cao-hospedagem");

        select.innerHTML = '<option value="">Selecione um cão</option>';

        caesCadastrados.forEach(cao => {
            select.innerHTML += `
                <option value="${Number(cao.id_cao)}">
                    ${escaparHTML(cao.nome)}
                </option>
            `;
        });

    } catch (erro) {
        console.error(erro);
    }
}


// Converte uma data para o formato brasileiro.
function formatarDataHora(valor) {
    if (!valor) return "-";

    const data = new Date(valor);

    if (isNaN(data.getTime())) return "-";

    return data.toLocaleString("pt-BR");
}


// Lista as hospedagens e atualiza a tabela.
export async function listarHospedagens() {
    try {
        const [respostaHospedagens, respostaCaes] = await Promise.all([
            fetch("/hospedagens"),
            fetch("/caes")
        ]);

        if (!respostaHospedagens.ok || !respostaCaes.ok) {
            throw new Error("Erro ao consultar hospedagens.");
        }

        hospedagensCadastradas = await respostaHospedagens.json();
        caesCadastrados = await respostaCaes.json();

        const tabela = document.querySelector("#lista-hospedagens");

        if (hospedagensCadastradas.length === 0) {
            tabela.innerHTML = `
                <tr>
                    <td colspan="7">Nenhuma hospedagem cadastrada.</td>
                </tr>
            `;
            return;
        }

        tabela.innerHTML = hospedagensCadastradas.map(hospedagem => {
            const cao = caesCadastrados.find(
                item => Number(item.id_cao) === Number(hospedagem.cao_id)
            );

            const situacao = hospedagem.data_saida &&
                new Date(hospedagem.data_saida) < new Date()
                ? "Finalizada"
                : "Em andamento";

            return `
                <tr>
                    <td>${Number(hospedagem.id_hospedagem)}</td>
                    <td>${escaparHTML(cao ? cao.nome : "Não encontrado")}</td>
                    <td>${escaparHTML(hospedagem.peso_registrado ?? "-")}</td>
                    <td>${formatarDataHora(hospedagem.data_entrada)}</td>
                    <td>${formatarDataHora(hospedagem.data_saida)}</td>
                    <td>${situacao}</td>
                    <td>
                        <button type="button" class="btn-acao btn-editar"
                            onclick="editarHospedagem(${Number(hospedagem.id_hospedagem)})">
                            Editar
                        </button>

                        <button type="button" class="btn-acao btn-excluir"
                            onclick="excluirHospedagem(${Number(hospedagem.id_hospedagem)})">
                            Excluir
                        </button>
                    </td>
                </tr>
            `;
        }).join("");

    } catch (erro) {
        document.querySelector("#lista-hospedagens").innerHTML = `
            <tr>
                <td colspan="7">Erro ao carregar hospedagens.</td>
            </tr>
        `;
        console.error(erro);
    }
}


// Cadastra uma hospedagem ou atualiza uma existente.
async function salvarHospedagem(event) {
    event.preventDefault();

    const id = document.querySelector("#id-hospedagem").value;
    const dataEntrada = document.querySelector("#data-entrada").value;
    const dataSaida = document.querySelector("#data-saida").value;

    const mensagem = document.querySelector("#mensagem-hospedagem");

    if (dataSaida && new Date(dataSaida) < new Date(dataEntrada)) {
        mostrarMensagem(mensagem, "A saída não pode ser anterior à entrada.", true);
        return;
    }

    const dados = {
        cao_id: document.querySelector("#cao-hospedagem").value,
        peso_registrado: document.querySelector("#peso-hospedagem").value,
        data_entrada: dataEntrada,
        data_saida: dataSaida || null
    };

    try {
        const resposta = await fetch(
            id ? `/hospedagens/${id}` : "/hospedagens",
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
            throw new Error(resultado.erro || "Erro ao salvar hospedagem.");
        }

        cancelarEdicaoHospedagem();
        mostrarMensagem(
            mensagem,
            resultado.mensagem || "Hospedagem salva com sucesso."
        );
        await listarHospedagens();

    } catch (erro) {
        mostrarMensagem(mensagem, erro.message, true);
    }
}


// Preenche o formulário com os dados da hospedagem selecionada.
export function editarHospedagem(id) {
    const hospedagem = hospedagensCadastradas.find(
        item => Number(item.id_hospedagem) === Number(id)
    );

    if (!hospedagem) return;

    document.querySelector("#id-hospedagem").value = hospedagem.id_hospedagem;
    document.querySelector("#cao-hospedagem").value = hospedagem.cao_id;
    document.querySelector("#peso-hospedagem").value = hospedagem.peso_registrado;
    document.querySelector("#data-entrada").value =
        hospedagem.data_entrada.slice(0, 16);
    document.querySelector("#data-saida").value =
        hospedagem.data_saida ? hospedagem.data_saida.slice(0, 16) : "";

    document.querySelector("#titulo-form-hospedagem").textContent =
        "Editar hospedagem";

    document.querySelector("#botao-salvar-hospedagem").textContent =
        "Salvar alterações";

    document.querySelector("#botao-cancelar-hospedagem").hidden = false;
    document.querySelector("#mensagem-hospedagem").textContent = "";

    document.querySelector("#form-hospedagem").scrollIntoView({
        behavior: "smooth"
    });
}


// Limpa o formulário e encerra a edição.
function cancelarEdicaoHospedagem() {
    document.querySelector("#form-hospedagem").reset();
    document.querySelector("#id-hospedagem").value = "";

    document.querySelector("#titulo-form-hospedagem").textContent =
        "Cadastrar hospedagem";

    document.querySelector("#botao-salvar-hospedagem").textContent =
        "Cadastrar hospedagem";

    document.querySelector("#botao-cancelar-hospedagem").hidden = true;
}


// Exclui uma hospedagem após a confirmação.
export async function excluirHospedagem(id) {
    if (!confirm("Deseja realmente excluir esta hospedagem?")) {
        return;
    }

    const mensagem = document.querySelector("#mensagem-hospedagem");

    try {
        const resposta = await fetch(`/hospedagens/${id}`, {
            method: "DELETE"
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(resultado.erro || "Erro ao excluir hospedagem.");
        }

        if (document.querySelector("#id-hospedagem").value == id) {
            cancelarEdicaoHospedagem();
        }

        mostrarMensagem(
            mensagem,
            resultado.mensagem || "Hospedagem excluída com sucesso."
        );
        await listarHospedagens();

    } catch (erro) {
        mostrarMensagem(mensagem, erro.message, true);
    }
}


// Inicializa os dados e os eventos da página de hospedagens.
export async function inicializarHospedagens() {
    document.querySelector("#form-hospedagem").addEventListener(
        "submit",
        salvarHospedagem
    );

    document.querySelector("#botao-cancelar-hospedagem").addEventListener(
        "click",
        cancelarEdicaoHospedagem
    );

    await Promise.all([
        carregarCaesNoSelect(),
        listarHospedagens()
    ]);
}