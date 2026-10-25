// Mural dos Sonhadores — o mesmo script serve o hub (raiz) e a página de cada jogo (<body data-jogo="id">).
// Dados: apoiadores.json (quem apoiou e em quais créditos aparece) + jogos.json (nome, loja, fundo e cores de cada jogo).
(() => {
	const jogo = document.body.dataset.jogo || "";
	const base = jogo ? "../" : "";
	const el = (tag, attrs = {}, texto) => {
		const e = document.createElement(tag);
		for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
		if (texto !== undefined) e.textContent = texto;
		return e;
	};
	const ordenarNiveis = d => (d.niveis || []).slice().sort((a, b) => (a.ordem || 0) - (b.ordem || 0));
	const apoiou = (a, id) => (a.jogos || []).includes(id);
	const nosCreditos = (a, id) => !(a.projetos || []).length || a.projetos.includes(id);

	function listaPorNivel(destino, d, pessoas) {
		let algum = false;
		for (const n of ordenarNiveis(d)) {
			const nomes = pessoas.filter(a => a.nivel === n.id).map(a => a.nome).sort((x, y) => x.localeCompare(y, "pt-BR"));
			if (!nomes.length) continue;
			algum = true;
			destino.appendChild(el("h3", {}, n.nome));
			const ul = el("ul", {class: "nomes " + n.id});
			for (const nome of nomes) ul.appendChild(el("li", {}, nome));
			destino.appendChild(ul);
		}
		return algum;
	}

	function paginaJogo(main, d, j) {
		const c = j.cores || {};
		for (const [k, v] of Object.entries(c)) document.documentElement.style.setProperty("--" + k, v);
		if (j.fundo) document.body.style.backgroundImage = `url("${base}${j.fundo}")`;
		if (j.banner) main.appendChild(el("img", {class: "banner", src: base + j.banner, alt: j.nome}));
		main.appendChild(el("h1", {}, "Mural dos Sonhadores"));
		const sub = el("p", {class: "sub"});
		sub.append("Gente que ajudou o ", el("b", {}, j.curto || j.nome), " a existir. Obrigado! 🌙 Todos estes nomes aparecem nos créditos do jogo.");
		main.appendChild(sub);

		const apoiadores = (d.apoiadores || []).filter(a => apoiou(a, jogo));
		main.appendChild(el("h2", {}, "Apoiaram o " + (j.curto || j.nome)));
		if (!listaPorNivel(main, d, apoiadores))
			main.appendChild(el("p", {class: "vazio"}, "Ainda ninguém por aqui. Seu nome pode ser o primeiro!"));

		const outros = (d.apoiadores || []).filter(a => !apoiou(a, jogo) && nosCreditos(a, jogo));
		if (outros.length) {
			main.appendChild(el("h2", {}, "Sonhadores de outros jogos do estúdio"));
			main.appendChild(el("p", {class: "sub"}, "Quem apoia um jogo da HQ Forge Studios aparece nos créditos de todos os próximos."));
			listaPorNivel(main, d, outros);
		}
		if (j.loja) {
			main.appendChild(el("h2", {}, "Quer entrar no mural?"));
			main.appendChild(el("p", {class: "sub"}, "Pague qualquer valor acima do mínimo e seu nome entra aqui e nos créditos."));
			main.appendChild(el("a", {class: "botao", href: j.loja}, "Apoiar o " + (j.curto || j.nome)));
		}
	}

	function hub(main, d, jogos) {
		main.appendChild(el("h1", {}, "Mural dos Sonhadores"));
		main.appendChild(el("p", {class: "sub"}, `Gente que ajuda os jogos da ${d.estudio || "HQ Forge Studios"} a existirem. Escolha um jogo para ver o mural dele.`));
		const ul = el("ul", {class: "jogos"});
		for (const [id, j] of Object.entries(jogos)) {
			const a = el("a", {href: id + "/"});
			if (j.banner) a.appendChild(el("img", {src: j.banner, alt: ""}));
			a.appendChild(el("span", {}, j.nome));
			const li = el("li"); li.appendChild(a); ul.appendChild(li);
		}
		main.appendChild(ul);
		main.appendChild(el("h2", {}, "Todos os Sonhadores"));
		listaPorNivel(main, d, d.apoiadores || []);
	}

	Promise.all([
		fetch(base + "apoiadores.json", {cache: "no-store"}).then(r => r.json()),
		fetch(base + "jogos.json", {cache: "no-store"}).then(r => r.json()),
	]).then(([d, jogos]) => {
		const main = document.getElementById("mural");
		main.textContent = "";
		if (jogo && jogos[jogo]) paginaJogo(main, d, jogos[jogo]);
		else hub(main, d, jogos);
		const f = el("footer");
		f.append(`Atualizado em ${d.atualizado || "—"} · `, el("a", {href: base + "apoiadores.json"}, "lista em JSON"));
		if (jogo) f.append(" · ", el("a", {href: base}, "todos os jogos do estúdio"));
		main.appendChild(f);
	}).catch(() => { document.getElementById("mural").textContent = "Não deu para carregar a lista agora."; });
})();
