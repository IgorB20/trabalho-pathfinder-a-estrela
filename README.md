# Trabalho Pathfinder A*

Implementação do algoritmo A* para comparar dois cenários de rota entre capitais brasileiras:

- cenário normal;
- cenário com congestionamento.

Origem e destino configurados:

```text
Florianópolis -> Brasília
```

## Instalar

```bash
npm install
```

Para gerar imagens dos grafos, instale o Graphviz:

```bash
brew install graphviz
```

## Comandos principais

Rodar o algoritmo e gerar os arquivos `.dot`:

```bash
npm run gerar-dot
```

Gerar o grafo do cenário normal:

```bash
npm run cenario-normal
```

Gerar o grafo do cenário congestionado:

```bash
npm run cenario-congestionado
```

Gerar PNG dos dois cenários:

```bash
npm run gerar-png
```

Gerar SVG dos dois cenários:

```bash
npm run gerar-svg
```

Gerar tudo:

```bash
npm run gerar-grafos
```

## Arquivos

- `index.js`: executa os cenários.
- `aEstrela.js`: algoritmo A*.
- `setup.js`: leitura dos dados e criação da matriz.
- `graphviz.js`: geração dos grafos.
- `resources/`: enunciado, PDF e JSONs usados no trabalho.
