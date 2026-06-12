const fs = require("fs");
const path = require("path");

function lerJson(nomeArquivo) {
    const caminho = path.join(__dirname, "resources", nomeArquivo);
    const conteudo = fs.readFileSync(caminho, "utf8");

    return JSON.parse(conteudo);
}

function buscarDistancia(distancias, origem, destino) {
    const chaveDireta = `${origem}:${destino}`;
    const chaveInversa = `${destino}:${origem}`;

    if (distancias[chaveDireta] !== undefined) {
        return distancias[chaveDireta];
    }

    if (distancias[chaveInversa] !== undefined) {
        return distancias[chaveInversa];
    }

    return Infinity;
}

function criarMatrizGrafo(distancias, capitais) {
    return capitais.map((origem) => {
        return capitais.map((destino) => buscarDistancia(distancias, origem, destino));
    });
}

function criarIndiceCapitais(capitais) {
    return capitais.reduce((indice, capital, posicao) => {
        indice[capital] = posicao;
        return indice;
    }, {});
}

module.exports = {
    lerJson,
    buscarDistancia,
    criarMatrizGrafo,
    criarIndiceCapitais,
};
