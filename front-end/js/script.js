// Importa a função que atualiza os números do Dashboard.
import { atualizarDashboard } from "./dashboard.js";

// Importa as funções responsáveis pela página de tutores.
import {
    listarTutores,
    salvarTutor,
    editarTutor,
    cancelarEdicao,
    excluirTutor
} from "./tutores.js";

// Importa as funções responsáveis pela página de cães.
import {
    carregarTutoresNoSelect,
    listarCaes,
    salvarCao,
    editarCao,
    cancelarEdicaoCao,
    excluirCao
} from "./caes.js";

// Importa as funções responsáveis pela página de hospedagens.
import {
    inicializarHospedagens,
    editarHospedagem,
    excluirHospedagem
} from "./hospedagens.js";


// ==========================================================
// ELEMENTOS PRINCIPAIS
// ==========================================================

// Seleciona a área onde o conteúdo das páginas será exibido.
const conteudo = document.querySelector(".conteudo");

// Seleciona todos os links do menu lateral.
const linksMenu = document.querySelectorAll(".sidebar nav a");


// ==========================================================
// FUNÇÕES DOS BOTÕES
// ==========================================================

// Disponibiliza as funções no objeto window para que os atributos
// onclick dos botões criados dinamicamente consigam acessá-las.
window.editarTutor = editarTutor;
window.excluirTutor = excluirTutor;

window.editarCao = editarCao;
window.excluirCao = excluirCao;

window.editarHospedagem = editarHospedagem;
window.excluirHospedagem = excluirHospedagem;


// ==========================================================
// CONTEÚDO DAS PÁGINAS
// ==========================================================

// Cada propriedade contém o HTML que será exibido
// quando o usuário selecionar uma página no menu.
const paginas = {

    // Página inicial com os totais do sistema.
    Dashboard: `
        <header>
            <h1>Dashboard</h1>
            <p>Bem-vindo ao sistema do Hotel para Cães.</p>
        </header>

        <section class="cards">
            <div class="card">
                <h3>Tutores</h3>
                <p id="total-tutores">0</p>
            </div>

            <div class="card">
                <h3>Cães</h3>
                <p id="total-caes">0</p>
            </div>

            <div class="card">
                <h3>Hospedagens</h3>
                <p id="total-hospedagens">0</p>
            </div>
        </section>
    `,

    // Página de cadastro, edição e consulta de tutores.
    Tutores: `
        <header>
            <h1>Tutores</h1>
            <p>Gerenciamento dos tutores cadastrados.</p>
        </header>

        <section class="card">
            <h3 id="titulo-formulario">Cadastrar tutor</h3>

            <form id="form-tutor">
                <input type="hidden" id="id-tutor">

                <label>Nome</label>
                <input type="text" id="nome" required>

                <label>Telefone</label>
                <input type="text" id="telefone" required>

                <label>E-mail</label>
                <input type="email" id="email">

                <label>Morada</label>
                <input type="text" id="morada">

                <button type="submit" id="botao-cadastrar">
                    Cadastrar tutor
                </button>

                <button type="button" id="botao-cancelar" hidden>
                    Cancelar edição
                </button>
            </form>

            <p id="mensagem-tutor"></p>
        </section>

        <section class="card">
            <h3>Tutores cadastrados</h3>

            <div class="tabela-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Telefone</th>
                            <th>E-mail</th>
                            <th>Morada</th>
                            <th>Ações</th>
                        </tr>
                    </thead>

                    <tbody id="lista-tutores">
                        <tr>
                            <td colspan="6">Carregando tutores...</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    `,

    // Página de cadastro, edição e consulta de cães.
    Cães: `
        <header>
            <h1>Cães</h1>
            <p>Gerenciamento dos cães cadastrados.</p>
        </header>

        <section class="card">
            <h3 id="titulo-form-cao">Cadastrar cão</h3>

            <form id="form-cao">
                <input type="hidden" id="id-cao">

                <label>Nome</label>
                <input type="text" id="nome-cao" required>

                <label>Raça</label>
                <input type="text" id="raca-cao" required>

                <label>Sexo</label>
                <select id="sexo-cao" required>
                    <option value="">Selecione</option>
                    <option value="Macho">Macho</option>
                    <option value="Fêmea">Fêmea</option>
                </select>

                <label>Peso atual (kg)</label>
                <input type="number" id="peso-cao" step="0.01" min="0.01" required>

                <label>Porte</label>
                <select id="porte-cao" required>
                    <option value="">Selecione</option>
                    <option value="Pequeno">Pequeno</option>
                    <option value="Médio">Médio</option>
                    <option value="Grande">Grande</option>
                </select>

                <label>Idade (anos)</label>
                <input type="number" id="idade-cao" min="0" step="1" required>

                <label>Castrado?</label>
                <select id="castrado-cao" required>
                    <option value="">Selecione</option>
                    <option value="true">Sim</option>
                    <option value="false">Não</option>
                </select>

                <label>Observações</label>
                <textarea id="observacoes-cao" rows="3"></textarea>

                <label>Tutor responsável</label>
                <select id="tutor-cao" required>
                    <option value="">Carregando tutores...</option>
                </select>

                <button type="submit" id="botao-salvar-cao">
                    Cadastrar cão
                </button>

                <button type="button" id="botao-cancelar-cao" hidden>
                    Cancelar edição
                </button>
            </form>

            <p id="mensagem-cao"></p>
        </section>

        <section class="card">
            <h3>Cães cadastrados</h3>

            <div class="tabela-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Raça</th>
                            <th>Sexo</th>
                            <th>Peso</th>
                            <th>Porte</th>
                            <th>Idade</th>
                            <th>Castrado</th>
                            <th>Observações</th>
                            <th>Tutor</th>
                            <th>Ações</th>
                        </tr>
                    </thead>

                    <tbody id="lista-caes">
                        <tr>
                            <td colspan="11">Carregando cães...</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    `,

    // Página de cadastro, edição e consulta de hospedagens.
    Hospedagens: `
        <header>
            <h1>Hospedagens</h1>
            <p>Controle de entrada e saída dos cães.</p>
        </header>

        <section class="card">
            <h3 id="titulo-form-hospedagem">Cadastrar hospedagem</h3>

            <form id="form-hospedagem">
                <input type="hidden" id="id-hospedagem">

                <label>Cão</label>
                <select id="cao-hospedagem" required>
                    <option value="">Carregando cães...</option>
                </select>

                <label>Peso registrado na entrada (kg)</label>
                <input
                    type="number"
                    id="peso-hospedagem"
                    step="0.01"
                    min="0.01"
                    required
                >

                <label>Data e horário de entrada</label>
                <input
                    type="datetime-local"
                    id="data-entrada"
                    required
                >

                <label>Data e horário de saída</label>
                <input
                    type="datetime-local"
                    id="data-saida"
                >

                <button type="submit" id="botao-salvar-hospedagem">
                    Cadastrar hospedagem
                </button>

                <button
                    type="button"
                    id="botao-cancelar-hospedagem"
                    hidden
                >
                    Cancelar edição
                </button>
            </form>

            <p id="mensagem-hospedagem"></p>
        </section>

        <section class="card">
            <h3>Hospedagens cadastradas</h3>

            <div class="tabela-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Cão</th>
                            <th>Peso registrado</th>
                            <th>Entrada</th>
                            <th>Saída</th>
                            <th>Situação</th>
                            <th>Ações</th>
                        </tr>
                    </thead>

                    <tbody id="lista-hospedagens">
                        <tr>
                            <td colspan="7">Carregando hospedagens...</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    `
};


// ==========================================================
// IDENTIFICAR A PÁGINA
// ==========================================================

// Padroniza os nomes usados no menu para identificar a página correta.
// "Inicio", "Início" e "Dashboard" abrem a mesma página.
function identificarPagina(nome) {
    if (nome === "Inicio" || nome === "Início" || nome === "Dashboard") {
        return "Dashboard";
    }

    return nome;
}


// ==========================================================
// NAVEGAÇÃO ENTRE PÁGINAS
// ==========================================================

// Substitui o conteúdo principal pelo HTML da página selecionada.
function abrirPagina(nome) {
    const pagina = identificarPagina(nome);

    // Não faz nada se o nome não corresponder a uma página existente.
    if (!paginas[pagina]) return;

    conteudo.innerHTML = paginas[pagina];

    // Atualiza o destaque do item selecionado no menu.
    linksMenu.forEach(link => {
        link.classList.toggle(
            "ativo",
            identificarPagina(link.textContent.trim()) === pagina
        );
    });


    // Atualiza os totais quando o Dashboard é aberto.
    if (pagina === "Dashboard") {
        atualizarDashboard();
    }


    // Inicializa os eventos e os dados da página de tutores.
    if (pagina === "Tutores") {
        listarTutores();

        document.querySelector("#form-tutor").addEventListener(
            "submit",
            salvarTutor
        );

        document.querySelector("#botao-cancelar").addEventListener(
            "click",
            cancelarEdicao
        );
    }


    // Inicializa os eventos e os dados da página de cães.
    if (pagina === "Cães") {
        carregarTutoresNoSelect();
        listarCaes();

        document.querySelector("#form-cao").addEventListener(
            "submit",
            salvarCao
        );

        document.querySelector("#botao-cancelar-cao").addEventListener(
            "click",
            cancelarEdicaoCao
        );
    }


    // Inicializa os eventos e os dados da página de hospedagens.
    if (pagina === "Hospedagens") {
        inicializarHospedagens();
    }
}


// ==========================================================
// CLIQUES DO MENU
// ==========================================================

// Adiciona um evento a cada link do menu lateral.
linksMenu.forEach(link => {
    link.addEventListener("click", function(event) {
        // Evita que o navegador siga o link "#".
        event.preventDefault();

        // Abre a página correspondente ao texto do link.
        abrirPagina(this.textContent.trim());
    });
});


// ==========================================================
// ABRIR PÁGINA INICIAL
// ==========================================================

// Exibe o Dashboard assim que o sistema é carregado.
abrirPagina("Inicio");
