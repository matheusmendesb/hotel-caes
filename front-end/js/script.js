
// Importa as funções utilizadas em cada página.
import { atualizarDashboard } from "./dashboard.js";

import {
    listarTutores,
    salvarTutor,
    editarTutor,
    cancelarEdicao,
    excluirTutor
} from "./tutores.js";

import {
    carregarTutoresNoSelect,
    listarCaes,
    salvarCao,
    editarCao,
    cancelarEdicaoCao,
    excluirCao
} from "./caes.js";

import {
    inicializarHospedagens,
    editarHospedagem,
    excluirHospedagem
} from "./hospedagens.js";


// Elementos principais da página.
const conteudo = document.querySelector(".conteudo");
const linksMenu = document.querySelectorAll(".sidebar nav a");


// Disponibiliza as funções de edição e exclusão para os botões das tabelas.
window.editarTutor = editarTutor;
window.excluirTutor = excluirTutor;
window.editarCao = editarCao;
window.excluirCao = excluirCao;
window.editarHospedagem = editarHospedagem;
window.excluirHospedagem = excluirHospedagem;


// Conteúdo HTML de cada página do sistema.
const paginas = {

    Dashboard: `
        <header>
            <span class="pagina-subtitulo">VISÃO GERAL</span>
            <h1>Painel inicial</h1>
            <p>Acompanhe os cadastros e a movimentação do Hotel Carmesim.</p>
        </header>

        <section class="cards">
            <div class="card">
                <h3>Tutores cadastrados</h3>
                <p id="total-tutores">0</p>
            </div>

            <div class="card">
                <h3>Cães cadastrados</h3>
                <p id="total-caes">0</p>
            </div>

            <div class="card">
                <h3>Hospedagens registradas</h3>
                <p id="total-hospedagens">0</p>
            </div>
        </section>

        <section class="apresentacao">
            <div class="apresentacao-conteudo">
                <span class="pagina-subtitulo">HOTEL CARMESIM</span>

                <h2>Gestão organizada, cuidado em cada detalhe.</h2>

                <p>
                    Um ambiente centralizado para administrar tutores,
                    cães e hospedagens, facilitando o acompanhamento
                    das atividades do hotel.
                </p>
            </div>
        </section>
    `,

    // Formulário e tabela de tutores.
    Tutores: `
        <header>
            <span class="pagina-subtitulo">CADASTROS</span>
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

                <label>Endereço</label>
                <input type="text" id="endereco">

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
                            <th>Endereço</th>
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

    // Formulário e tabela de cães.
    Cães: `
        <header>
            <span class="pagina-subtitulo">CADASTROS</span>
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

    // Formulário e tabela de hospedagens.
    Hospedagens: `
        <header>
            <span class="pagina-subtitulo">OPERAÇÃO</span>
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
                <input type="number" id="peso-hospedagem"
                    step="0.01" min="0.01" required>

                <label>Data e horário de entrada</label>
                <input type="datetime-local" id="data-entrada" required>

                <label>Data e horário de saída</label>
                <input type="datetime-local" id="data-saida">

                <button type="submit" id="botao-salvar-hospedagem">
                    Cadastrar hospedagem
                </button>

                <button type="button" id="botao-cancelar-hospedagem" hidden>
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


// Identifica qual página deve ser aberta.
function identificarPagina(nome) {
    const nomeNormalizado = nome.trim().toLowerCase();

    if (
        nomeNormalizado === "inicio" ||
        nomeNormalizado === "início" ||
        nomeNormalizado === "dashboard"
    ) {
        return "Dashboard";
    }

    if (nomeNormalizado === "tutores") return "Tutores";
    if (nomeNormalizado === "cães" || nomeNormalizado === "caes") return "Cães";
    if (nomeNormalizado === "hospedagens") return "Hospedagens";

    return nome;
}


// Obtém o nome do menu sem incluir o texto dos ícones.
function obterNomeDoMenu(link) {
    const texto = link.querySelector(".menu-label")
        || link.querySelector("span:last-child");

    return texto ? texto.textContent.trim() : link.textContent.trim();
}


// Abre a página escolhida e carrega seus dados.
function abrirPagina(nome) {
    const pagina = identificarPagina(nome);

    if (!paginas[pagina]) return;

    conteudo.innerHTML = paginas[pagina];

    // Atualiza o destaque do menu.
    linksMenu.forEach(link => {
        const nomeMenu = identificarPagina(obterNomeDoMenu(link));
        link.classList.toggle("ativo", nomeMenu === pagina);
    });

    // Carrega os indicadores do painel inicial.
    if (pagina === "Dashboard") {
        atualizarDashboard();
    }

    // Carrega tutores e configura os botões do formulário.
    if (pagina === "Tutores") {
        listarTutores();

        document.querySelector("#form-tutor").addEventListener(
            "submit", salvarTutor
        );

        document.querySelector("#botao-cancelar").addEventListener(
            "click", cancelarEdicao
        );
    }

    // Carrega cães, tutores e configura o formulário.
    if (pagina === "Cães") {
        carregarTutoresNoSelect();
        listarCaes();

        document.querySelector("#form-cao").addEventListener(
            "submit", salvarCao
        );

        document.querySelector("#botao-cancelar-cao").addEventListener(
            "click", cancelarEdicaoCao
        );
    }

    // Inicializa os dados e eventos das hospedagens.
    if (pagina === "Hospedagens") {
        inicializarHospedagens();
    }
}


// Configura a navegação do menu lateral.
linksMenu.forEach(link => {
    link.addEventListener("click", function(event) {
        event.preventDefault();
        abrirPagina(obterNomeDoMenu(this));
    });
});


// Abre o painel inicial ao iniciar o sistema.
abrirPagina("Início");