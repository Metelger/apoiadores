# Apoiadores — HQ Forge Studios

Mural dos Sonhadores: quem apoia os jogos da HQ Forge Studios, publicado pelo GitHub Pages.
Um projeto só, com **uma página por jogo** (fundo e cores do jogo) e uma lista de dados única.

- Mural do Naninha: https://metelger.github.io/apoiadores/naninha/
- Todos os jogos (hub): https://metelger.github.io/apoiadores/
- Dados (o que os jogos baixam): https://metelger.github.io/apoiadores/apoiadores.json

## Como adicionar alguém
1. Importe a planilha do jogo: `python3 -I ferramentas/importar_planilha.py planilha.csv --jogo naninha --coluna-nome "Name" --coluna-valor "Amount" --guardiao-a-partir 10`
   (ou edite `apoiadores.json` à mão).
2. `git commit` + `git push`. Em ~1 minuto o Pages publica.
3. Os jogos mostram os nomes novos da próxima vez que alguém abrir os créditos com internet (sem precisar de versão nova).

## Como adicionar um jogo novo
1. Crie a pasta `<id>/` com `fundo.png` (fundo da página), `banner.png` (topo, ~960×300) e `icone.png`.
2. Copie `naninha/index.html` para `<id>/index.html` e troque `data-jogo`, o título e as tags `og:`.
3. Adicione o jogo em `jogos.json` (nome, frase, link da loja, imagens e cores).

## Formato
- `jogos.json`: por id do jogo — `nome`, `curto`, `frase`, `loja`, `fundo`, `banner`, `icone`, `cores` (variáveis CSS).
- `apoiadores.json`:
  - `niveis`: `id`, `nome` (aparece nos créditos e no mural), `ordem` (1 = primeiro).
  - `apoiadores`: `nome`, `nivel`, `jogos` (jogos que a pessoa apoiou → em qual mural ela aparece),
    `projetos` (em quais créditos o nome aparece; vazio = todos os jogos, que é a promessa do Mural).
- Página de um jogo: "Apoiaram o <jogo>" (quem tem o jogo em `jogos`) + "Sonhadores de outros jogos do estúdio"
  (quem também aparece nos créditos dele).

## Nos jogos (Forja)
O módulo `Apoiadores` (Godot) fica no template da Forja. Ele lê `apoiadores.json` e filtra por `projetos`
(campos novos são ignorados). Antes de cada build, `tools/atualizar_apoiadores.py` baixa uma cópia para dentro do build.
