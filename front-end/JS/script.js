
const conteudo = document.querySelector(".conteudo");
const linksMenu = document.querySelectorAll(".sidebar nav a");

let tutoresCadastrados = [];

const paginas = {
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

    Cães: `
        <header>
            <h1>Cães</h1>
            <p>Gerenciamento dos cães cadastrados.</p>
        </header>
        <section class="card">
            <h3>Cadastro de cães</h3>
            <p>Em desenvolvimento.</p>
        </section>
    `,

    Hospedagens: `
        <header>
            <h1>Hospedagens</h1>
            <p>Gerenciamento das hospedagens.</p>
        </header>
        <section class="card">
            <h3>Controle de hospedagens</h3>
            <p>Em desenvolvimento.</p>
        </section>
    `
};


// DASHBOARD

async function atualizarDashboard() {
    try {
        const [resTutores, resCaes, resHospedagens] = await Promise.all([
            fetch("/tutores"),
            fetch("/caes"),
            fetch("/hospedagens")
        ]);

        if (!resTutores.ok || !resCaes.ok || !resHospedagens.ok) {
            throw new Error("Erro ao consultar os dados.");
        }

        const tutores = await resTutores.json();
        const caes = await resCaes.json();
        const hospedagens = await resHospedagens.json();

        document.querySelector("#total-tutores").textContent = tutores.length;
        document.querySelector("#total-caes").textContent = caes.length;
        document.querySelector("#total-hospedagens").textContent = hospedagens.length;

    } catch (erro) {
        console.error("Erro ao atualizar dashboard:", erro);
    }
}


// CONSULTAR TUTORES

async function listarTutores() {
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
                    <td>${tutor.morada || "-"}</td>
                    <td>
                        <button type="button"
                            onclick="editarTutor(${tutor.id_tutor})">
                            Editar
                        </button>

                        <button type="button"
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


// CADASTRAR OU EDITAR TUTOR

async function salvarTutor(event) {
    event.preventDefault();

    const idTutor = document.querySelector("#id-tutor").value;

    const tutor = {
        nome: document.querySelector("#nome").value,
        telefone: document.querySelector("#telefone").value,
        email: document.querySelector("#email").value,
        morada: document.querySelector("#morada").value
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

        document.querySelector("#form-tutor").reset();
        cancelarEdicao();

        await listarTutores();

    } catch (erro) {
        mensagem.textContent = erro.message;
    }
}


// PREPARAR EDIÇÃO

function editarTutor(idTutor) {
    const tutor = tutoresCadastrados.find(
        item => item.id_tutor === idTutor
    );

    if (!tutor) return;

    document.querySelector("#id-tutor").value = tutor.id_tutor;
    document.querySelector("#nome").value = tutor.nome;
    document.querySelector("#telefone").value = tutor.telefone;
    document.querySelector("#email").value = tutor.email || "";
    document.querySelector("#morada").value = tutor.morada || "";

    document.querySelector("#titulo-formulario").textContent = "Editar tutor";
    document.querySelector("#botao-cadastrar").textContent = "Salvar alterações";
    document.querySelector("#botao-cancelar").hidden = false;

    document.querySelector("#mensagem-tutor").textContent = "";

    document.querySelector("#form-tutor").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


// CANCELAR EDIÇÃO

function cancelarEdicao() {
    document.querySelector("#form-tutor").reset();
    document.querySelector("#id-tutor").value = "";

    document.querySelector("#titulo-formulario").textContent = "Cadastrar tutor";
    document.querySelector("#botao-cadastrar").textContent = "Cadastrar tutor";
    document.querySelector("#botao-cancelar").hidden = true;
}


// EXCLUIR TUTOR

async function excluirTutor(idTutor) {
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

        document.querySelector("#mensagem-tutor").textContent = resultado.mensagem;

        await listarTutores();

    } catch (erro) {
        document.querySelector("#mensagem-tutor").textContent = erro.message;
    }
}


// ABRIR PÁGINAS

function abrirPagina(pagina) {
    if (!paginas[pagina]) return;

    conteudo.innerHTML = paginas[pagina];

    linksMenu.forEach(link => {
        link.classList.toggle("ativo", link.textContent.trim() === pagina);
    });

    if (pagina === "Dashboard") {
        atualizarDashboard();
    }

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
}


linksMenu.forEach(link => {
    link.addEventListener("click", function(event) {
        event.preventDefault();
        abrirPagina(this.textContent.trim());
    });
});


atualizarDashboard();