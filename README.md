# Apoiadores — HQ Forge Studios

Lista única de apoiadores de **todos os jogos** da HQ Forge Studios, publicada pelo GitHub Pages:

- Mural (página para mostrar/divulgar): https://metelger.github.io/apoiadores/
- Dados (o que os jogos baixam): https://metelger.github.io/apoiadores/apoiadores.json

## Como adicionar alguém
1. Edite `apoiadores.json` (ou importe uma planilha: `python3 ferramentas/importar_planilha.py planilha.csv --coluna-nome "Name"`).
2. `git commit` + `git push`. Em ~1 minuto o Pages publica.
3. Os jogos mostram os nomes novos da próxima vez que alguém abrir os créditos com internet (sem precisar de versão nova).
   Sem internet, o jogo usa a última lista baixada ou a que veio no build.

## Formato
- `niveis`: `id`, `nome` (aparece nos créditos e no mural), `ordem` (1 = primeiro).
- `apoiadores`: `nome`, `nivel` (id de um nível), `projetos` (lista de ids de jogos; vazia = todos os jogos).

## Nos jogos (Forja)
O módulo `Apoiadores` (Godot) fica no template da Forja (`~/GameForge/templates/godot-2d/.../apoiadores.gd`).
Antes de cada build, `tools/atualizar_apoiadores.py` (no projeto do jogo) baixa uma cópia desta lista para dentro do build.
