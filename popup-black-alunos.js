/* BLACK · A Revolução do Estudo — pop-up de cadastro SÓ para ALUNOS LOGADOS no portal
 * Portal Thinkr (souconcurseiroevoupassar.com). Carregado pelo loader global do template.
 *
 * Regras:
 *  - Só roda quando window.thinkrLogged == 1 (o template Thinkr expõe thinkrLogged / thinkrName / thinkrEmail)
 *  - Nome e e-mail vêm do login: o aluno só informa o WhatsApp (e-mail aparece só se o login não trouxer)
 *  - Abre 2 s depois de CADA página carregar, até o aluno se cadastrar (regra do Fábio 13/10: insistir).
 *    Fechou sem cadastrar → volta na próxima página. Cadastrou → nunca mais
 *  - Cadastro = edge gerador-paginas, slug black-revolucao-alunos (sem pixel, aluno_mentoria = sim)
 *  - Copy segue a regra do agente black_alunos: NUNCA cita produto, preço ou condição. Só "revolução nos estudos"
 *  - Depois do cadastro mostra o passo 2: grupo dos alunos (link da live de 27/10 só no grupo)
 */
(function () {
  "use strict";
  if (window.__scvpBlackAlunos) return; window.__scvpBlackAlunos = true;

  var API = "https://dqpxugdhlgafvddavzzp.supabase.co/functions/v1/gerador-paginas";
  var ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxcHh1Z2RobGdhZnZkZGF2enpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxODQ1NTMsImV4cCI6MjA5Nzc2MDU1M30.nUhYPO3oLUZEXgQCDlRtL-Jawi0nr0l1Z7_z5ecEXvc"; /* chave pública (anon) do Data Core — a mesma das páginas da Black */
  var SLUG = "black-revolucao-alunos";
  var GRUPO = "https://sndflw.com/i/4OSYf8OR5Ac5eJh0UGBk";       /* fallback: release BLACK · ALUNOS */
  var STORE = "scvp_black_pop_alunos_v1";
  var DELAY_MS = 2000;
  var SKIP_PATHS = ["/admin", "/checkout", "/carrinho"];
  var LIVE_LABEL = "27 DE OUTUBRO · 20H BRASÍLIA · AO VIVO";

  /* ---------- gates ---------- */
  function logged() { return String(window.thinkrLogged || "0") === "1"; }
  function skipPath() { var p = location.pathname; for (var i = 0; i < SKIP_PATHS.length; i++) if (p.indexOf(SKIP_PATHS[i]) === 0) return true; return false; }
  function store() { try { return JSON.parse(localStorage.getItem(STORE) || "null") || {}; } catch (_) { return {}; } }
  function save(o) { try { localStorage.setItem(STORE, JSON.stringify(o)); } catch (_) {} }
  function podeAbrir() {
    return !store().done; /* só o cadastro desliga; fechar não desliga */
  }
  function nomeLogin() { return String(window.thinkrName || "").trim().slice(0, 120); }
  function emailLogin() { return String(window.thinkrEmail || "").trim().toLowerCase().slice(0, 160); }
  function primeiroNome() { var n = nomeLogin().split(/\s+/)[0] || ""; return n ? n.charAt(0).toUpperCase() + n.slice(1).toLowerCase() : ""; }

  var KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "fbclid"];
  function attr() {
    var out = {}, i, k;
    ["scvp_utm_v1", "scvp_attr"].forEach(function (key) {
      try { var s = JSON.parse(localStorage.getItem(key) || "null"); if (s) for (i = 0; i < KEYS.length; i++) if (s[KEYS[i]]) out[KEYS[i]] = s[KEYS[i]]; if (s && (s.ts || s._ts)) out.ts = s.ts || s._ts; } catch (_) {}
    });
    try { var q = new URLSearchParams(location.search); for (i = 0; i < KEYS.length; i++) { k = q.get(KEYS[i]); if (k) out[KEYS[i]] = k; } } catch (_) {}
    return out;
  }
  function cookie(n) { var m = document.cookie.match(new RegExp("(?:^|; )" + n + "=([^;]*)")); return m ? decodeURIComponent(m[1]) : null; }

  /* ---------- CSS (mesma identidade do pop-up de visitantes) ---------- */
  var CSS = '@import url("https://fonts.googleapis.com/css2?family=Saira:wght@600;700;800&family=Figtree:wght@400;500;600;700&display=swap");' +
  '.bka-ov{position:fixed;inset:0;background:rgba(3,4,6,.78);backdrop-filter:blur(3px);z-index:2147483000;display:none;align-items:center;justify-content:center;padding:16px;font-family:Figtree,system-ui,sans-serif}' +
  '.bka-ov.on{display:flex}' +
  '@keyframes bkaUp{from{transform:translateY(24px);opacity:0}to{transform:none;opacity:1}}' +
  '.bka{position:relative;width:100%;max-width:440px;background:#0f1217;color:#f4f5f7;border:1px solid rgba(255,255,255,.12);border-radius:20px;box-shadow:0 30px 80px rgba(0,0,0,.6),0 0 60px rgba(0,170,210,.18);overflow:hidden;animation:bkaUp .32s ease;box-sizing:border-box;text-align:center}' +
  '.bka *{box-sizing:border-box}' +
  '.bka-top{height:4px;background:linear-gradient(90deg,#006f8a,#00c4ea,#009BBE)}' +
  '.bka-x{position:absolute;top:10px;right:10px;width:34px;height:34px;border-radius:50%;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.06);color:#c8ccd3;font-size:22px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0}' +
  '.bka-x:hover{background:rgba(255,255,255,.12);color:#fff}' +
  '.bka-in{padding:26px 24px 22px}' +
  '.bka-pill{display:inline-block;font-family:Saira,system-ui,sans-serif;font-weight:700;font-size:11.5px;letter-spacing:.14em;text-transform:uppercase;color:#07080b;background:#1cc6e6;border-radius:999px;padding:7px 14px;margin:0 0 14px}' +
  '.bka-eyebrow{font-family:Saira,system-ui,sans-serif;font-weight:600;font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:#009BBE;margin:0 0 8px}' +
  '.bka h3{font-family:Saira,system-ui,sans-serif;font-weight:800;font-size:24px;line-height:1.15;margin:0 0 10px;color:#fff;text-transform:uppercase;letter-spacing:.01em}' +
  '.bka h3 em{font-style:normal;color:#1cc6e6}' +
  '.bka p{margin:0 0 16px;font-size:15px;line-height:1.5;color:#c8ccd3}' +
  '.bka-quote{font-style:italic;color:#f4f5f7;border-left:3px solid #009BBE;padding-left:12px;text-align:left;font-size:14px}' +
  '.bka label{display:block;text-align:left;font-size:13px;font-weight:600;color:#c8ccd3;margin:0 0 6px}' +
  '.bka input{width:100%;height:46px;padding:0 14px;border-radius:12px;border:1px solid rgba(255,255,255,.16);background:#171b22;color:#fff;font-family:inherit;font-size:15px;margin:0 0 12px;-webkit-appearance:none;appearance:none;outline:0}' +
  '.bka input::placeholder{color:#8b919b}.bka input:focus{border-color:#1cc6e6;box-shadow:0 0 0 3px rgba(28,198,230,.18)}' +
  '.bka .err{border-color:#e5484d!important}' +
  '.bka-btn{width:100%;height:50px;border:0;border-radius:999px;background:#1cc6e6;color:#07080b;font-family:Saira,system-ui,sans-serif;font-weight:800;font-size:15px;letter-spacing:.06em;text-transform:uppercase;cursor:pointer;box-shadow:0 8px 28px rgba(0,170,210,.45);margin-top:4px;display:flex;align-items:center;justify-content:center;gap:8px;text-decoration:none}' +
  '.bka-btn:hover{background:#38d4f0}.bka-btn:disabled{opacity:.6;cursor:wait}' +
  '.bka-msg{display:none;color:#ff8f93;font-size:13px;margin:0 0 10px}.bka-msg.show{display:block}' +
  '.bka-note{font-size:12px;color:#8b919b;margin:12px 0 0;line-height:1.5}' +
  '.bka-bar{height:8px;border-radius:999px;background:rgba(255,255,255,.1);overflow:hidden;margin:4px 0 14px}.bka-bar i{display:block;height:100%;width:0;background:linear-gradient(90deg,#009BBE,#1cc6e6);transition:width 1.1s ease}' +
  '@media (max-width:420px){.bka h3{font-size:21px}.bka-in{padding:22px 18px 18px}}';

  function html() {
    var pn = primeiroNome(), temEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLogin());
    return '<div class="bka" role="dialog" aria-modal="true" aria-labelledby="bkaTitle"><div class="bka-top"></div>' +
    '<button type="button" class="bka-x" id="bkaX" aria-label="Fechar">&times;</button>' +
    '<div class="bka-in" id="bkaStep1">' +
      '<span class="bka-pill">' + LIVE_LABEL + '</span>' +
      '<p class="bka-eyebrow">Exclusivo para alunos</p>' +
      '<h3 id="bkaTitle">' + (pn ? pn + ", " : "") + 'a revolução nos estudos chega <em>primeiro para você</em></h3>' +
      '<p class="bka-quote">“Você já deu o passo. Agora a sua preparação vai andar junto com a sua vida.”</p>' +
      '<p>Live exclusiva para alunos com o professor Fábio Silva, terça 27/10 às 20h de Brasília (19h de Manaus). O link chega só no grupo do WhatsApp.</p>' +
      '<form id="bkaForm" novalidate>' +
        '<label for="bkaTel">Seu WhatsApp</label><input id="bkaTel" name="telefone" type="tel" inputmode="numeric" autocomplete="tel" placeholder="(92) 99999-9999" maxlength="15">' +
        (temEmail ? '' : '<label for="bkaEmail">E-mail</label><input id="bkaEmail" name="email" type="email" inputmode="email" autocomplete="email" placeholder="seu@email.com">') +
        '<div class="bka-msg" id="bkaMsg"></div>' +
        '<button type="submit" class="bka-btn" id="bkaBtn">Quero estar na live &rarr;</button>' +
      '</form>' +
      '<p class="bka-note">' + (temEmail ? 'Cadastro com o e-mail da sua conta: ' + emailLogin() + '<br>' : '') + 'Sem custo · Link no grupo dos alunos</p>' +
    '</div>' +
    '<div class="bka-in" id="bkaStep2" style="display:none">' +
      '<p class="bka-eyebrow">Cadastro confirmado</p>' +
      '<h3>Falta <em>um passo</em></h3>' +
      '<div class="bka-bar"><i id="bkaBar"></i></div>' +
      '<p>Entre no grupo dos alunos. É lá que você recebe o link da live de 27/10 e os avisos. Grupo silencioso: só avisos.</p>' +
      '<a class="bka-btn" id="bkaGrupo" href="' + GRUPO + '" target="_blank" rel="noopener">Entrar no grupo dos alunos &rarr;</a>' +
      '<p class="bka-note">Você pode fechar esta janela depois de entrar.</p>' +
    '</div></div>';
  }

  var ov, aberto = false, registroId = null;
  function headers() { return { "Content-Type": "application/json", "Authorization": "Bearer " + ANON, "apikey": ANON }; }

  function build() {
    var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);
    ov = document.createElement("div"); ov.className = "bka-ov"; ov.id = "bkaOv"; ov.innerHTML = html();
    document.body.appendChild(ov);
    document.getElementById("bkaX").addEventListener("click", fechar);
    ov.addEventListener("click", function (e) { if (e.target === ov) fechar(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && aberto) fechar(); });
    var tel = document.getElementById("bkaTel");
    tel.addEventListener("input", function () {
      var d = tel.value.replace(/\D/g, "").slice(0, 11), o = "";
      if (d.length > 0) o = "(" + d.slice(0, 2); if (d.length >= 3) o += ") " + d.slice(2, 7); if (d.length >= 8) o += "-" + d.slice(7);
      tel.value = o;
    });
    document.getElementById("bkaForm").addEventListener("submit", enviar);
    document.getElementById("bkaGrupo").addEventListener("click", function () {
      save({ done: true, at: Date.now() });
      if (!registroId) return;
      try { fetch(API, { method: "POST", headers: headers(), body: JSON.stringify({ op: "grupo_click", registro_id: registroId, modo: "pop-aluno" }), keepalive: true }).catch(function () {}); } catch (_) {}
    });
  }
  function abrir() {
    if (aberto || !podeAbrir()) return;
    if (!ov) build();
    aberto = true; ov.classList.add("on"); document.body.style.overflow = "hidden";
    setTimeout(function () { var t = document.getElementById("bkaTel"); if (t) t.focus({ preventScroll: true }); }, 350);
  }
  function fechar() {
    if (!aberto) return;
    aberto = false; ov.classList.remove("on"); document.body.style.overflow = "";
    var s = store(); if (!s.done) save({ closedAt: Date.now(), n: (s.n || 0) + 1 });
  }

  function enviar(ev) {
    ev.preventDefault();
    var tel = document.getElementById("bkaTel"), emEl = document.getElementById("bkaEmail"), btn = document.getElementById("bkaBtn"), msg = document.getElementById("bkaMsg");
    var digits = tel.value.replace(/\D/g, "");
    var email = emEl ? emEl.value.trim().toLowerCase() : emailLogin();
    var ok = true;
    var telOk = digits.length === 11 && digits[2] === "9"; tel.classList.toggle("err", !telOk); ok = ok && telOk;
    var emOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); if (emEl) emEl.classList.toggle("err", !emOk); ok = ok && emOk;
    msg.classList.remove("show");
    if (!ok) { msg.textContent = !telOk ? "Confira o WhatsApp: DDD + número com 9 dígitos." : "Confira o e-mail."; msg.classList.add("show"); return; }

    var nome = nomeLogin();
    if (nome.length < 2) nome = (email.split("@")[0] || "Aluno(a)").replace(/[._\-+0-9]+/g, " ").trim() || "Aluno(a)";

    var a = attr(), utm = {};
    ["utm_source", "utm_medium", "utm_campaign", "utm_term"].forEach(function (k) { if (a[k]) utm[k] = a[k]; });
    if (!utm.utm_source) { utm.utm_source = "portal"; utm.utm_medium = "popup"; utm.utm_campaign = "black-alunos"; }
    utm.utm_content = "popup-alunos";
    var payload = {
      op: "lead", slug: SLUG, nome: nome, email: email, telefone: digits, escolaridade: "", aluno_mentoria: "sim",
      answers: { origem: "portal-logado" }, utm: utm,
      fbclid: a.fbclid || null, fbclid_ts: a.ts || Date.now(), fbp: cookie("_fbp"), fbc: cookie("_fbc"), page_url: location.href
    };
    btn.disabled = true; btn.textContent = "ENVIANDO…";
    fetch(API, { method: "POST", headers: headers(), body: JSON.stringify(payload) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { if (!r.ok) throw new Error(d.error || "erro"); return d; }); })
      .then(function (r) {
        registroId = r.registro_id || null;
        var dest = r.redirect_url || r.redirect_url_desq || GRUPO;
        document.getElementById("bkaGrupo").href = dest;
        save({ done: true, at: Date.now(), reg: registroId });
        document.getElementById("bkaStep1").style.display = "none";
        document.getElementById("bkaStep2").style.display = "block";
        setTimeout(function () { document.getElementById("bkaBar").style.width = "84%"; }, 150);
      })
      .catch(function (e) {
        btn.disabled = false; btn.innerHTML = "Quero estar na live &rarr;";
        msg.textContent = /whatsapp/i.test(e.message) ? "Confira o WhatsApp: DDD + número com 9 dígitos." : "Não conseguimos enviar agora. Tente de novo em instantes.";
        msg.classList.add("show");
      });
  }

  function armar() {
    if (!logged() || skipPath() || !podeAbrir()) return;
    setTimeout(abrir, DELAY_MS);
  }
  window.scvpBlackPopupAlunos = { open: function () { if (!logged()) return; if (!ov) build(); if (!aberto) { aberto = true; ov.classList.add("on"); document.body.style.overflow = "hidden"; } }, reset: function () { try { localStorage.removeItem(STORE); } catch (_) {} } };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", armar); else armar();
})();
