// Atualiza os números apresentados nos cards do Dashboard.
export async function atualizarDashboard() {
    try {
        // Consulta tutores, cães e hospedagens ao mesmo tempo.
        const [resTutores, resCaes, resHospedagens] = await Promise.all([
            fetch("/tutores"),
            fetch("/caes"),
            fetch("/hospedagens")
        ]);

        // Verifica se todas as consultas foram concluídas corretamente.
        if (!resTutores.ok || !resCaes.ok || !resHospedagens.ok) {
            throw new Error("Erro ao consultar os dados.");
        }

        // Converte as respostas recebidas para objetos JavaScript.
        const tutores = await resTutores.json();
        const caes = await resCaes.json();
        const hospedagens = await resHospedagens.json();

        // Atualiza cada card com a quantidade de registros.
        document.querySelector("#total-tutores").textContent = tutores.length;
        document.querySelector("#total-caes").textContent = caes.length;
        document.querySelector("#total-hospedagens").textContent = hospedagens.length;

    } catch (erro) {
        // Exibe no console qualquer problema durante a atualização.
        console.error("Erro ao atualizar dashboard:", erro);
    }
}