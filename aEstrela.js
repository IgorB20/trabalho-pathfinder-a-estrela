function calcularHeuristica(heuristicas, cidadeAtual, destino) {
    const chave = `${cidadeAtual}:${destino}`;

    return heuristicas[chave] ?? 0;
}

function escolherCidadeComMenorF(abertos) {
    let melhorIndice = 0;

    for (let i = 1; i < abertos.length; i++) {
        if (abertos[i].f < abertos[melhorIndice].f) {
            melhorIndice = i;
        }
    }

    return abertos[melhorIndice];
}

function reconstruirCaminho(veioDe, origem, destino) {
    const caminho = [destino];
    let cidadeAtual = destino;

    while (cidadeAtual !== origem) {
        cidadeAtual = veioDe[cidadeAtual];
        caminho.unshift(cidadeAtual);
    }

    return caminho;
}

function registrarPasso(historico, cidadeAtual, abertos, fechados) {
    historico.push({
        atual: cidadeAtual,
        abertos: abertos.map((item) => item.cidade),
        fechados: [...fechados],
    });
}

function aEstrela(matrizGrafo, capitais, heuristicas, origem, destino) {
    const abertos = [];
    const fechados = [];
    const veioDe = {};
    const custoAteAgora = {};
    const historico = [];

    custoAteAgora[origem] = 0;

    abertos.push({
        cidade: origem,
        g: 0,
        h: calcularHeuristica(heuristicas, origem, destino),
        f: calcularHeuristica(heuristicas, origem, destino),
    });

    while (abertos.length > 0) {
        const cidadeEscolhida = escolherCidadeComMenorF(abertos);
        const cidadeAtual = cidadeEscolhida.cidade;
        const indiceAberto = abertos.findIndex((item) => item.cidade === cidadeAtual);

        abertos.splice(indiceAberto, 1);
        fechados.push(cidadeAtual);

        if (cidadeAtual === destino) {
            registrarPasso(historico, cidadeAtual, abertos, fechados);

            return {
                caminho: reconstruirCaminho(veioDe, origem, destino),
                custo: custoAteAgora[destino],
                historico,
            };
        }

        const indiceAtual = capitais.indexOf(cidadeAtual);

        for (let indiceVizinho = 0; indiceVizinho < capitais.length; indiceVizinho++) {
            const peso = matrizGrafo[indiceAtual][indiceVizinho];
            const vizinho = capitais[indiceVizinho];

            if (peso === 0 || !Number.isFinite(peso) || fechados.includes(vizinho)) {
                continue;
            }

            const novoCusto = custoAteAgora[cidadeAtual] + peso;
            const custoAnterior = custoAteAgora[vizinho];

            if (custoAnterior !== undefined && novoCusto >= custoAnterior) {
                continue;
            }

            veioDe[vizinho] = cidadeAtual;
            custoAteAgora[vizinho] = novoCusto;

            const h = calcularHeuristica(heuristicas, vizinho, destino);
            const f = novoCusto + h;
            const vizinhoAberto = abertos.find((item) => item.cidade === vizinho);

            if (vizinhoAberto) {
                vizinhoAberto.g = novoCusto;
                vizinhoAberto.h = h;
                vizinhoAberto.f = f;
            } else {
                abertos.push({
                    cidade: vizinho,
                    g: novoCusto,
                    h,
                    f,
                });
            }
        }

        registrarPasso(historico, cidadeAtual, abertos, fechados);
    }

    return {
        caminho: [],
        custo: Infinity,
        historico,
    };
}

module.exports = {
    aEstrela,
};
