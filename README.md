# Trabalho Pathfinder A*

Implementação do algoritmo A* para encontrar rotas de menor custo entre capitais brasileiras usando:

- `resources/distancias.json`: pesos das arestas, com distâncias por estrada.
- `resources/distancias_linha_reta.json`: heurística do A*, com distâncias em linha reta.

O cenário configurado atualmente é:

```text
Origem: Florianópolis
Destino: Brasília
```

## Requisitos

Instale as dependências do projeto:

```bash
npm install
```

Para gerar imagens dos grafos, instale também o Graphviz no sistema:

```bash
brew install graphviz
```

Verifique se o comando `dot` ficou disponível:

```bash
dot -V
```

## Rodar o algoritmo

Execute:

```bash
node index.js
```

Ou:

```bash
npm run gerar-dot
```

A saída mostra:

- cenário normal;
- cenário com congestionamento;
- listas de abertos e fechados;
- comparação das rotas.

## Gerar os grafos

O comando abaixo executa o algoritmo e recria os arquivos `.dot`:

```bash
npm run gerar-dot
```

Arquivos gerados:

```text
grafo_normal.dot
grafo_congestionado.dot
```

Para gerar apenas o grafo do cenário normal:

```bash
npm run cenario-normal
```

Arquivo gerado:

```text
grafo_normal.svg
```

Para gerar apenas o grafo do cenário congestionado:

```bash
npm run cenario-congestionado
```

Arquivo gerado:

```text
grafo_congestionado.png
```

Para gerar PNG dos dois cenários:

```bash
npm run gerar-png
```

Arquivos gerados:

```text
grafo_normal.png
grafo_congestionado.png
```

Para gerar SVG dos dois cenários:

```bash
npm run gerar-svg
```

Arquivos gerados:

```text
grafo_normal.svg
grafo_congestionado.svg
```

Para gerar tudo de uma vez:

```bash
npm run gerar-grafos
```

## Cenários

### Cenário normal

Usa diretamente os pesos de `distancias.json`.

Rota atual:

```text
Florianópolis -> Curitiba -> Brasília
```

### Cenário com congestionamento

Aumenta o peso dos trechos:

```text
Florianópolis -> Curitiba
Curitiba -> Brasília
```

Com isso, o algoritmo passa a evitar Curitiba e escolhe uma rota alternativa.

## Arquivos principais

- `index.js`: executa os cenários e imprime os resultados.
- `aEstrela.js`: implementação simples do algoritmo A*.
- `setup.js`: leitura dos JSONs e criação da matriz do grafo.
- `graphviz.js`: geração dos arquivos `.dot`.
- `resources/enunciado.md`: enunciado do trabalho.
- `resources/capitais.json`: lista de capitais usadas no grafo.
- `resources/distancias.json`: distâncias por estrada.
- `resources/distancias_linha_reta.json`: heurística em linha reta.
- `resources/Distância em linha reta entre os Municípios das Capitais - 2022.pdf`: PDF original do IBGE.
