#!/usr/bin/env python3
"""Importa apoiadores de uma planilha CSV exportada (itch.io, Ko-fi, Apoia.se, Catarse...) para apoiadores.json.

Uso:
  python3 ferramentas/importar_planilha.py planilha.csv --coluna-nome "Name" [--nivel sonhador] [--projeto naninha]
  python3 ferramentas/importar_planilha.py planilha.csv --coluna-nome "Nome" --coluna-valor "Valor" --guardiao-a-partir 50

- Nomes que já estão na lista não são duplicados (comparação sem maiúsculas/acentos de espaço).
- --coluna-valor + --guardiao-a-partir: quem apoiou com valor >= X vira "guardiao"; os demais, --nivel.
- --projeto: marca os novos nomes só para aquele jogo (padrão: todos os jogos).
- Linhas sem nome, ou com nome "anônimo"/"anonymous", são ignoradas.
Depois: confira o diff, faça commit e push — o GitHub Pages publica e os jogos baixam na próxima abertura dos créditos.
"""
import argparse, csv, datetime, json, pathlib, unicodedata

RAIZ = pathlib.Path(__file__).resolve().parent.parent
ARQ = RAIZ / "apoiadores.json"


def chave(nome: str) -> str:
	n = unicodedata.normalize("NFKD", nome).encode("ascii", "ignore").decode().lower()
	return " ".join(n.split())


def main() -> None:
	ap = argparse.ArgumentParser()
	ap.add_argument("csv")
	ap.add_argument("--coluna-nome", required=True)
	ap.add_argument("--coluna-valor")
	ap.add_argument("--guardiao-a-partir", type=float)
	ap.add_argument("--nivel", default="sonhador")
	ap.add_argument("--projeto")
	a = ap.parse_args()
	d = json.loads(ARQ.read_text(encoding="utf-8"))
	existentes = {chave(x["nome"]) for x in d["apoiadores"]}
	novos = 0
	with open(a.csv, newline="", encoding="utf-8-sig") as f:
		for linha in csv.DictReader(f):
			nome = (linha.get(a.coluna_nome) or "").strip()
			if not nome or chave(nome) in ("anonimo", "anonymous", "anon"):
				continue
			if chave(nome) in existentes:
				continue
			nivel = a.nivel
			if a.coluna_valor and a.guardiao_a_partir is not None:
				try:
					valor = float(str(linha.get(a.coluna_valor, "0")).replace("R$", "").replace("$", "").replace(",", ".").strip() or 0)
				except ValueError:
					valor = 0.0
				if valor >= a.guardiao_a_partir:
					nivel = "guardiao"
			d["apoiadores"].append({"nome": nome, "nivel": nivel, "projetos": [a.projeto] if a.projeto else []})
			existentes.add(chave(nome))
			novos += 1
	d["atualizado"] = datetime.date.today().isoformat()
	ARQ.write_text(json.dumps(d, ensure_ascii=False, indent="\t") + "\n", encoding="utf-8")
	print(f"{novos} apoiador(es) novo(s); total {len(d['apoiadores'])}")


if __name__ == "__main__":
	main()
