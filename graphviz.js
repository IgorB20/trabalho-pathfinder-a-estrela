const fs = require("fs");
const path = require("path");

function criarChaveAresta(origem, destino) {
    return [origem, destino].sort().join("--");
}

function criarArestasDoCaminho(caminho) {
    const arestas = new Set();

    for (let i = 0; i < caminho.length - 1; i++) {
        arestas.add(criarChaveAresta(caminho[i], caminho[i + 1]));
    }

    return arestas;
}

function buscarPesoNaMatriz(matriz, indiceCapitais, origem, destino) {
    return matriz[indiceCapitais[origem]][indiceCapitais[destino]];
}

function criarListaDeArestas(caminho, matriz, indiceCapitais, congestionamentos = []) {
    const arestas = [];
    const chavesAdicionadas = new Set();

    for (let i = 0; i < caminho.length - 1; i++) {
        const origem = caminho[i];
        const destino = caminho[i + 1];
        const chave = criarChaveAresta(origem, destino);

        arestas.push({
            origem,
            destino,
            peso: buscarPesoNaMatriz(matriz, indiceCapitais, origem, destino),
        });
        chavesAdicionadas.add(chave);
    }

    congestionamentos.forEach((congestionamento) => {
        const chave = criarChaveAresta(congestionamento.origem, congestionamento.destino);

        if (chavesAdicionadas.has(chave)) {
            return;
        }

        arestas.push({
            origem: congestionamento.origem,
            destino: congestionamento.destino,
            peso: buscarPesoNaMatriz(matriz, indiceCapitais, congestionamento.origem, congestionamento.destino),
        });
        chavesAdicionadas.add(chave);
    });

    return arestas;
}

function criarDot({ titulo, caminho, matriz, indiceCapitais, congestionamentos = [] }) {
    const cidades = new Set(caminho);
    const arestasDoCaminho = criarArestasDoCaminho(caminho);
    const arestasCongestionadas = new Set(
        congestionamentos.map((trecho) => criarChaveAresta(trecho.origem, trecho.destino)),
    );
    const arestas = criarListaDeArestas(caminho, matriz, indiceCapitais, congestionamentos);

    congestionamentos.forEach((trecho) => {
        cidades.add(trecho.origem);
        cidades.add(trecho.destino);
    });

    const linhas = [
        "graph G {",
        "    graph [",
        `        label=\"${titulo}\",`,
        "        labelloc=t,",
        "        fontsize=22,",
        "        rankdir=LR",
        "    ];",
        "    node [shape=box, style=\"rounded,filled\", fillcolor=\"#f8fafc\", color=\"#334155\", fontname=\"Arial\"];",
        "    edge [fontname=\"Arial\", color=\"#64748b\", penwidth=2];",
        "",
    ];

    Array.from(cidades).forEach((cidade) => {
        const isInicio = cidade === caminho[0];
        const isFim = cidade === caminho[caminho.length - 1];
        const cor = isInicio ? "#dcfce7" : isFim ? "#fee2e2" : "#f8fafc";

        linhas.push(`    "${cidade}" [fillcolor="${cor}"];`);
    });

    linhas.push("");

    arestas.forEach((aresta) => {
        const chave = criarChaveAresta(aresta.origem, aresta.destino);
        const noCaminho = arestasDoCaminho.has(chave);
        const congestionada = arestasCongestionadas.has(chave);
        const cor = congestionada ? "#dc2626" : noCaminho ? "#16a34a" : "#64748b";
        const largura = noCaminho || congestionada ? 4 : 2;
        const estilo = congestionada ? "dashed" : "solid";

        linhas.push(
            `    "${aresta.origem}" -- "${aresta.destino}" [label="${aresta.peso} km", color="${cor}", penwidth=${largura}, style="${estilo}"];`,
        );
    });

    linhas.push("}");

    return linhas.join("\n");
}

function salvarDot(nomeArquivo, opcoes) {
    const caminhoArquivo = path.join(__dirname, nomeArquivo);
    const conteudo = criarDot(opcoes);

    fs.writeFileSync(caminhoArquivo, conteudo, "utf8");

    return caminhoArquivo;
}

module.exports = {
    salvarDot,
};
