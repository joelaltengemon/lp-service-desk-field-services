/* Ponte entre o portal e o Apps Script, rodando no servidor do Vercel (nao no navegador
   de quem usa o portal).

   O Apps Script entrega o resultado em duas etapas: primeiro script.google.com responde
   com um redirecionamento (302) que carrega um cookie de sessao, e e esse cookie que
   autoriza a segunda parada (script.googleusercontent.com/macros/echo) a liberar o
   conteudo de verdade. Um navegador guarda e reenvia esse cookie sozinho sem ninguem
   perceber; um fetch de servidor com redirect:"follow" NAO faz isso, entao a segunda
   parada nega o acesso e devolve uma pagina de erro generica do Google Drive em vez do
   JSON. Por isso aqui o redirecionamento e seguido manualmente, carregando o cookie
   de uma etapa para a outra, exatamente como um navegador faria. */

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx813TFXBUlfR7QVT5EOp-Fx0k_sSPC4gMR7afWJDM1qAUkGE7YkWQFpGiyg7xjOTIN/exec";
const MAX_REDIRECIONAMENTOS = 5;

function juntarCookies(anteriores, resposta){
  const novos = typeof resposta.headers.getSetCookie === "function"
    ? resposta.headers.getSetCookie()
    : (resposta.headers.get("set-cookie") ? [resposta.headers.get("set-cookie")] : []);
  if (!novos.length) return anteriores;
  const mapa = {};
  (anteriores || "").split(";").map(s => s.trim()).filter(Boolean).forEach(par => {
    const i = par.indexOf("=");
    if (i > 0) mapa[par.slice(0, i)] = par.slice(i + 1);
  });
  novos.forEach(linha => {
    const par = linha.split(";")[0];
    const i = par.indexOf("=");
    if (i > 0) mapa[par.slice(0, i).trim()] = par.slice(i + 1).trim();
  });
  return Object.keys(mapa).map(k => k + "=" + mapa[k]).join("; ");
}

/* Segue redirecionamentos manualmente, carregando cookies de uma etapa para a outra. */
async function buscarComCookies(urlInicial, opcoesIniciais){
  let url = urlInicial;
  let opcoes = opcoesIniciais;
  let cookies = "";
  for (let i = 0; i < MAX_REDIRECIONAMENTOS; i++){
    const r = await fetch(url, Object.assign({}, opcoes, {
      redirect: "manual",
      headers: Object.assign({}, (opcoes && opcoes.headers) || {}, cookies ? {Cookie: cookies} : {})
    }));
    cookies = juntarCookies(cookies, r);
    if (r.status >= 300 && r.status < 400 && r.headers.get("location")){
      url = new URL(r.headers.get("location"), url).toString();
      opcoes = {method: "GET"}; // redirecionamento sempre vira GET, igual navegador faz
      continue;
    }
    return r;
  }
  throw new Error("redirecionamentos demais seguindo o Apps Script");
}

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  const inicio = Date.now();

  try {
    let alvo, opcoes;
    if (req.method === "GET") {
      const qs = new URLSearchParams(req.query || {}).toString();
      alvo = APPS_SCRIPT_URL + (qs ? "?" + qs : "");
      opcoes = {method: "GET"};
    } else if (req.method === "POST") {
      let corpo = req.body;
      if (corpo && typeof corpo !== "string") corpo = JSON.stringify(corpo);
      alvo = APPS_SCRIPT_URL;
      opcoes = {method: "POST", headers: {"Content-Type": "text/plain;charset=utf-8"}, body: corpo || ""};
    } else {
      res.status(405).send(JSON.stringify({ok: false, erro: "metodo nao permitido"}));
      return;
    }

    const r = await buscarComCookies(alvo, opcoes);
    const texto = await r.text();
    console.log("[portal-leads-sync] ok em " + (Date.now() - inicio) + "ms, status " + r.status + ", " + texto.length + " bytes");
    res.status(200).send(texto);
  } catch (e) {
    console.error("[portal-leads-sync] falhou em " + (Date.now() - inicio) + "ms: " + String(e));
    res.status(200).send(JSON.stringify({ok: false, erro: "falha na ponte do portal: " + String(e)}));
  }
}
