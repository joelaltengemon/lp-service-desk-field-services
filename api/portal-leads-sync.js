/* Ponte entre o portal e o Apps Script, rodando no servidor do Vercel (nao no navegador
   de quem usa o portal). Isso existe porque, em algumas redes corporativas (ex: escritorio
   da Engemon IT em Alphaville), um sistema de seguranca (CASB/proxy de inspecao) intercepta
   e bloqueia a entrega de conteudo do Apps Script quando a chamada sai de um navegador
   logado com conta Google. Fazendo essa chamada a partir do servidor do Vercel, o navegador
   do usuario nunca fala diretamente com script.google.com nem com googleusercontent.com,
   entao esse tipo de bloqueio deixa de afetar a sincronizacao do portal. */

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx813TFXBUlfR7QVT5EOp-Fx0k_sSPC4gMR7afWJDM1qAUkGE7YkWQFpGiyg7xjOTIN/exec";

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");

  try {
    if (req.method === "GET") {
      const qs = new URLSearchParams(req.query || {}).toString();
      const alvo = APPS_SCRIPT_URL + (qs ? "?" + qs : "");
      const r = await fetch(alvo, { redirect: "follow" });
      const texto = await r.text();
      res.status(200).send(texto);
      return;
    }

    if (req.method === "POST") {
      let corpo = req.body;
      if (corpo && typeof corpo !== "string") corpo = JSON.stringify(corpo);
      const r = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: corpo || "",
        redirect: "follow"
      });
      const texto = await r.text();
      res.status(200).send(texto);
      return;
    }

    res.status(405).send(JSON.stringify({ ok: false, erro: "metodo nao permitido" }));
  } catch (e) {
    res.status(200).send(JSON.stringify({ ok: false, erro: "falha na ponte do portal: " + String(e) }));
  }
}
