const {
    lerJson,
    criarMatrizGrafo,
    criarIndiceCapitais,
} = require("./setup");
const { aEstrela } = require("./aEstrela");
const { salvarDot } = require("./graphviz");

const ORIGEM = "Florianópolis";
const DESTINO = "Brasília";
const CONGESTIONAMENTOS = [
    { origem: "Florianópolis", destino: "Curitiba", multiplicador: 3 },
    { origem: "Curitiba", destino: "Brasília", multiplicador: 2 },
];

const capitais = lerJson("capitais.json");
const distancias = lerJson("distancias.json");
const heuristicas = lerJson("distancias_linha_reta.json");
const matrizGrafo = criarMatrizGrafo(distancias, capitais);
const indiceCapitais = criarIndiceCapitais(capitais);
const resultadoNormal = aEstrela(matrizGrafo, capitais, heuristicas, ORIGEM, DESTINO);
const matrizCongestionada = criarMatrizCongestionada(matrizGrafo, indiceCapitais, CONGESTIONAMENTOS);
const resultadoCongestionado = aEstrela(matrizCongestionada, capitais, heuristicas, ORIGEM, DESTINO);
const arquivoGrafoNormal = salvarDot("grafo_normal.dot", {
    titulo: "Cenário normal",
    caminho: resultadoNormal.caminho,
    matriz: matrizGrafo,
    indiceCapitais,
});
const arquivoGrafoCongestionado = salvarDot("grafo_congestionado.dot", {
    titulo: "Cenário com congestionamento",
    caminho: resultadoCongestionado.caminho,
    matriz: matrizCongestionada,
    indiceCapitais,
    congestionamentos: CONGESTIONAMENTOS,
});

function copiarMatriz(matriz) {
    return matriz.map((linha) => [...linha]);
}

function aplicarCongestionamento(matriz, indiceCapitais, origem, destino, multiplicador) {
    const indiceOrigem = indiceCapitais[origem];
    const indiceDestino = indiceCapitais[destino];
    const pesoOriginal = matriz[indiceOrigem][indiceDestino];
    const novoPeso = pesoOriginal * multiplicador;

    matriz[indiceOrigem][indiceDestino] = novoPeso;
    matriz[indiceDestino][indiceOrigem] = novoPeso;

    return {
        origem,
        destino,
        pesoOriginal,
        novoPeso,
        multiplicador,
    };
}

function criarMatrizCongestionada(matrizOriginal, indiceCapitais, congestionamentos) {
    const matriz = copiarMatriz(matrizOriginal);

    congestionamentos.forEach((congestionamento) => {
        aplicarCongestionamento(
            matriz,
            indiceCapitais,
            congestionamento.origem,
            congestionamento.destino,
            congestionamento.multiplicador,
        );
    });

    return matriz;
}

function listarCongestionamentos(matrizOriginal, indiceCapitais, congestionamentos) {
    return congestionamentos.map((congestionamento) => {
        const indiceOrigem = indiceCapitais[congestionamento.origem];
        const indiceDestino = indiceCapitais[congestionamento.destino];
        const pesoOriginal = matrizOriginal[indiceOrigem][indiceDestino];

        return {
            ...congestionamento,
            pesoOriginal,
            novoPeso: pesoOriginal * congestionamento.multiplicador,
        };
    });
}

function imprimirLinha() {
    console.log("=".repeat(80));
}

function imprimirHistorico(historico) {
    console.log("\nListas de abertos e fechados por passo:");

    historico.forEach((passo, indice) => {
        console.log(`\nPasso ${indice + 1}`);
        console.log("Atual:", passo.atual);
        console.log("Abertos:", passo.abertos.join(", "));
        console.log("Fechados:", passo.fechados.join(", ") || "-");
    });
}

function imprimirResultadoCenario(titulo, resultado) {
    imprimirLinha();
    console.log(titulo);
    imprimirLinha();
    console.log("Caminho encontrado:", resultado.caminho.join(" -> "));
    console.log("Custo total:", resultado.custo, "km");
    imprimirHistorico(resultado.historico);
    console.log();
}

function compararCenarios(normal, congestionado) {
    imprimirLinha();
    console.log("COMPARAÇÃO DOS CENÁRIOS");
    imprimirLinha();
    console.log("Rota normal:", normal.caminho.join(" -> "));
    console.log("Rota congestionada:", congestionado.caminho.join(" -> "));
    console.log("Custo normal:", normal.custo, "km");
    console.log("Custo congestionado:", congestionado.custo, "km");

    const cidadesEvitadas = normal.caminho.filter((cidade) => !congestionado.caminho.includes(cidade));

    if (cidadesEvitadas.length > 0) {
        console.log("Cidades da rota normal evitadas no congestionamento:", cidadesEvitadas.join(", "));
    } else {
        console.log("O congestionamento não alterou as cidades da rota.");
    }

    console.log();
}

if (require.main === module) {
    imprimirLinha();
    console.log("Busca A* entre capitais brasileiras");
    imprimirLinha();
    console.log("Origem:", ORIGEM, "índice", indiceCapitais[ORIGEM]);
    console.log("Destino:", DESTINO, "índice", indiceCapitais[DESTINO]);
    console.log("Grafo usado: matriz completa de distâncias por estrada");
    console.log("Arquivo Graphviz normal:", arquivoGrafoNormal);
    console.log("Arquivo Graphviz congestionado:", arquivoGrafoCongestionado);
    console.log();

    imprimirResultadoCenario("CENÁRIO 1 - NORMAL", resultadoNormal);

    imprimirLinha();
    console.log("Trechos congestionados");
    imprimirLinha();
    listarCongestionamentos(matrizGrafo, indiceCapitais, CONGESTIONAMENTOS).forEach((trecho) => {
        console.log(
            `${trecho.origem} -> ${trecho.destino}: ${trecho.pesoOriginal} km x ${trecho.multiplicador} = ${trecho.novoPeso} km`,
        );
    });

    console.log();
    imprimirResultadoCenario("CENÁRIO 2 - CONGESTIONAMENTO", resultadoCongestionado);
    compararCenarios(resultadoNormal, resultadoCongestionado);
}

module.exports = {
    ORIGEM,
    DESTINO,
    CONGESTIONAMENTOS,
    resultadoNormal,
    resultadoCongestionado,
    arquivoGrafoNormal,
    arquivoGrafoCongestionado,
};
