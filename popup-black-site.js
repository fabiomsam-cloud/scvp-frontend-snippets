/* BLACK · A Revolução do Estudo — pop-up de cadastro para VISITANTES do portal (não logados)
 * Portal Thinkr (souconcurseiroevoupassar.com). Carregado pelo loader global do template.
 *
 * Regras:
 *  - Só roda para quem NÃO está logado (window.thinkrLogged != 1). Aluno logado = popup-black-alunos.js
 *  - Abre 1 vez: 7 s na página, OU 30% de rolagem, OU intenção de saída (mouse sobe pro topo, desktop)
 *  - Fechou sem cadastrar → volta só depois de 3 dias. Cadastrou → nunca mais
 *  - Cadastro = mesmo motor da página revolucaodoestudo.com.br (edge gerador-paginas,
 *    slug black-revolucao-nao-alunos): WhatsApp + e-mail + escolaridade. utm_content = "popup-site"
 *  - Depois do cadastro mostra o passo 2 (entrar no grupo) sem tirar a pessoa do portal
 */
(function () {
  "use strict";
  if (window.__scvpBlackSite) return; window.__scvpBlackSite = true;

  var API = "https://dqpxugdhlgafvddavzzp.supabase.co/functions/v1/gerador-paginas";
  var ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxcHh1Z2RobGdhZnZkZGF2enpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxODQ1NTMsImV4cCI6MjA5Nzc2MDU1M30.nUhYPO3oLUZEXgQCDlRtL-Jawi0nr0l1Z7_z5ecEXvc"; /* chave pública (anon) do Data Core — a mesma das páginas da Black */
  var SLUG = "black-revolucao-nao-alunos";
  var GRUPO = "https://sndflw.com/i/D3dZyygkzj3LQgQ73IHP";       /* fallback: release BLACK · NÃO ALUNOS */
  var STORE = "scvp_black_pop_v1";
  var DIAS_REAPARECER = 3;
  var DELAY_MS = 7000, SCROLL_PCT = 30;
  var SKIP_PATHS = ["/admin", "/alunos", "/cursos/ver/", "/checkout", "/carrinho"]; /* páginas de venda ficam de fora p/ não roubar a compra */
  var LIVE_LABEL = "10 DE NOVEMBRO · 20H · AO VIVO";

  /* ---------- gates ---------- */
  function logged() { return String(window.thinkrLogged || "0") === "1"; }
  function skipPath() {
    var p = location.pathname;
    for (var i = 0; i < SKIP_PATHS.length; i++) if (p.indexOf(SKIP_PATHS[i]) === 0) return true;
    return false;
  }
  function store() { try { return JSON.parse(localStorage.getItem(STORE) || "null") || {}; } catch (_) { return {}; } }
  function save(o) { try { localStorage.setItem(STORE, JSON.stringify(o)); } catch (_) {} }
  function podeAbrir() {
    var s = store();
    if (s.done) return false;
    if (s.closedAt && Date.now() - s.closedAt < DIAS_REAPARECER * 86400000) return false;
    return true;
  }

  /* ---------- atribuição (scvp_attr = páginas da Black · scvp_utm_v1 = modal do checkout) ---------- */
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

  /* ---------- CSS ---------- */
  var CSS = '@import url("https://fonts.googleapis.com/css2?family=Saira:wght@600;700;800&family=Figtree:wght@400;500;600;700&display=swap");' +
  '.bkp-ov{position:fixed;inset:0;background:rgba(3,4,6,.78);backdrop-filter:blur(3px);z-index:2147483000;display:none;align-items:center;justify-content:center;padding:16px;font-family:Figtree,system-ui,sans-serif}' +
  '.bkp-ov.on{display:flex}' +
  '@keyframes bkpUp{from{transform:translateY(24px);opacity:0}to{transform:none;opacity:1}}' +
  '.bkp{position:relative;width:100%;max-width:440px;background:#0f1217;color:#f4f5f7;border:1px solid rgba(255,255,255,.12);border-radius:20px;box-shadow:0 30px 80px rgba(0,0,0,.6),0 0 60px rgba(0,170,210,.18);overflow:hidden;animation:bkpUp .32s ease;box-sizing:border-box;text-align:center}' +
  '.bkp *{box-sizing:border-box}' +
  '.bkp-top{height:4px;background:linear-gradient(90deg,#006f8a,#00c4ea,#009BBE)}' +
  '.bkp-x{position:absolute;top:10px;right:10px;width:34px;height:34px;border-radius:50%;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.06);color:#c8ccd3;font-size:22px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0}' +
  '.bkp-x:hover{background:rgba(255,255,255,.12);color:#fff}' +
  '.bkp-in{padding:26px 24px 22px}' +
  '.bkp-pill{display:inline-block;font-family:Saira,system-ui,sans-serif;font-weight:700;font-size:11.5px;letter-spacing:.14em;text-transform:uppercase;color:#07080b;background:#1cc6e6;border-radius:999px;padding:7px 14px;margin:0 0 14px}' +
  '.bkp-eyebrow{font-family:Saira,system-ui,sans-serif;font-weight:600;font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:#009BBE;margin:0 0 8px}' +
  '.bkp h3{font-family:Saira,system-ui,sans-serif;font-weight:800;font-size:24px;line-height:1.15;margin:0 0 10px;color:#fff;text-transform:uppercase;letter-spacing:.01em}' +
  '.bkp h3 em{font-style:normal;color:#1cc6e6}' +
  '.bkp p{margin:0 0 16px;font-size:15px;line-height:1.5;color:#c8ccd3}' +
  '.bkp label{display:block;text-align:left;font-size:13px;font-weight:600;color:#c8ccd3;margin:0 0 6px}' +
  '.bkp input,.bkp select{width:100%;height:46px;padding:0 14px;border-radius:12px;border:1px solid rgba(255,255,255,.16);background:#171b22;color:#fff;font-family:inherit;font-size:15px;margin:0 0 12px;-webkit-appearance:none;appearance:none;outline:0}' +
  '.bkp select{background-image:url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'14\' height=\'8\' viewBox=\'0 0 14 8\'><path d=\'M1 1l6 6 6-6\' fill=\'none\' stroke=\'%23c8ccd3\' stroke-width=\'2\'/></svg>");background-repeat:no-repeat;background-position:right 14px center;padding-right:36px}' +
  '.bkp select.ph{color:#8b919b}.bkp select option{color:#111;background:#fff}' +
  '.bkp input::placeholder{color:#8b919b}.bkp input:focus,.bkp select:focus{border-color:#1cc6e6;box-shadow:0 0 0 3px rgba(28,198,230,.18)}' +
  '.bkp .err{border-color:#e5484d!important}' +
  '.bkp-btn{width:100%;height:50px;border:0;border-radius:999px;background:#1cc6e6;color:#07080b;font-family:Saira,system-ui,sans-serif;font-weight:800;font-size:15px;letter-spacing:.06em;text-transform:uppercase;cursor:pointer;box-shadow:0 8px 28px rgba(0,170,210,.45);margin-top:4px;display:flex;align-items:center;justify-content:center;gap:8px;text-decoration:none}' +
  '.bkp-btn:hover{background:#38d4f0}.bkp-btn:disabled{opacity:.6;cursor:wait}' +
  '.bkp-msg{display:none;color:#ff8f93;font-size:13px;margin:0 0 10px}.bkp-msg.show{display:block}' +
  '.bkp-note{font-size:12px;color:#8b919b;margin:12px 0 0;line-height:1.5}' +
  '.bkp-bar{height:8px;border-radius:999px;background:rgba(255,255,255,.1);overflow:hidden;margin:4px 0 14px}.bkp-bar i{display:block;height:100%;width:0;background:linear-gradient(90deg,#009BBE,#1cc6e6);transition:width 1.1s ease}' +
  '@media (max-width:420px){.bkp h3{font-size:21px}.bkp-in{padding:22px 18px 18px}}';

  /* ---------- HTML ---------- */
  var HTML =
  '<div class="bkp" role="dialog" aria-modal="true" aria-labelledby="bkpTitle"><div class="bkp-top"></div>' +
  '<button type="button" class="bkp-x" id="bkpX" aria-label="Fechar">&times;</button>' +
  '<div class="bkp-in" id="bkpStep1">' +
    '<span class="bkp-pill">' + LIVE_LABEL + '</span>' +
    '<p class="bkp-eyebrow">Black · A Revolução do Estudo</p>' +
    '<h3 id="bkpTitle">Você não precisa parar a sua vida <em>para mudar de vida</em></h3>' +
    '<p>Garanta o seu lugar na live gratuita com o professor Fábio Silva. O link chega no grupo do WhatsApp.</p>' +
    '<form id="bkpForm" novalidate>' +
      '<label for="bkpTel">WhatsApp</label><input id="bkpTel" name="telefone" type="tel" inputmode="numeric" autocomplete="tel" placeholder="(92) 99999-9999" maxlength="15">' +
      '<label for="bkpEmail">E-mail</label><input id="bkpEmail" name="email" type="email" inputmode="email" autocomplete="email" placeholder="seu@email.com">' +
      '<label for="bkpEsc">Escolaridade</label><select id="bkpEsc" name="escolaridade" class="ph">' +
        '<option value="" disabled selected>Qual a sua escolaridade?</option>' +
        '<option value="fundamental">Ensino Fundamental</option><option value="medio">Ensino Médio</option>' +
        '<option value="superior_cursando">Superior Cursando</option><option value="superior_completo">Superior Completo</option><option value="pos">Pós-graduação</option>' +
      '</select>' +
      '<div class="bkp-msg" id="bkpMsg"></div>' +
      '<button type="submit" class="bkp-btn" id="bkpBtn">Garantir meu lugar &rarr;</button>' +
    '</form>' +
    '<p class="bkp-note">Cadastro gratuito · Link no grupo do WhatsApp<br>Com Fábio Silva · Sou Concurseiro</p>' +
  '</div>' +
  '<div class="bkp-in" id="bkpStep2" style="display:none">' +
    '<p class="bkp-eyebrow">Cadastro confirmado</p>' +
    '<h3>Falta <em>um passo</em></h3>' +
    '<div class="bkp-bar"><i id="bkpBar"></i></div>' +
    '<p>Entre no grupo do WhatsApp. É lá que você recebe o link da live e os avisos da Black. Grupo silencioso: só avisos.</p>' +
    '<a class="bkp-btn" id="bkpGrupo" href="' + GRUPO + '" target="_blank" rel="noopener">Entrar no grupo agora &rarr;</a>' +
    '<p class="bkp-note">Você pode fechar esta janela depois de entrar.</p>' +
  '</div></div>';

  var ov, aberto = false, registroId = null;

  function build() {
    var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);
    ov = document.createElement("div"); ov.className = "bkp-ov"; ov.id = "bkpOv"; ov.innerHTML = HTML;
    document.body.appendChild(ov);
    document.getElementById("bkpX").addEventListener("click", fechar);
    ov.addEventListener("click", function (e) { if (e.target === ov) fechar(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && aberto) fechar(); });
    var tel = document.getElementById("bkpTel");
    tel.addEventListener("input", function () {
      var d = tel.value.replace(/\D/g, "").slice(0, 11), o = "";
      if (d.length > 0) o = "(" + d.slice(0, 2); if (d.length >= 3) o += ") " + d.slice(2, 7); if (d.length >= 8) o += "-" + d.slice(7);
      tel.value = o;
    });
    var sel = document.getElementById("bkpEsc");
    sel.addEventListener("change", function () { sel.classList.toggle("ph", !sel.value); });
    document.getElementById("bkpForm").addEventListener("submit", enviar);
    document.getElementById("bkpGrupo").addEventListener("click", function () {
      save({ done: true, at: Date.now() });
      if (!registroId) return;
      try { fetch(API, { method: "POST", headers: headers(), body: JSON.stringify({ op: "grupo_click", registro_id: registroId, modo: "pop-site" }), keepalive: true }).catch(function () {}); } catch (_) {}
    });
  }
  function headers() { return { "Content-Type": "application/json", "Authorization": "Bearer " + ANON, "apikey": ANON }; }

  function abrir() {
    if (aberto || !podeAbrir()) return;
    if (!ov) build();
    aberto = true; ov.classList.add("on"); document.body.style.overflow = "hidden";
    try { if (window.fbq) window.fbq("trackCustom", "BlackPopupView", { origem: "popup-site" }); } catch (_) {}
  }
  function fechar() {
    if (!aberto) return;
    aberto = false; ov.classList.remove("on"); document.body.style.overflow = "";
    var s = store(); if (!s.done) save({ closedAt: Date.now(), n: (s.n || 0) + 1 });
  }

  function enviar(ev) {
    ev.preventDefault();
    var tel = document.getElementById("bkpTel"), em = document.getElementById("bkpEmail"), esc = document.getElementById("bkpEsc"), btn = document.getElementById("bkpBtn"), msg = document.getElementById("bkpMsg");
    var digits = tel.value.replace(/\D/g, ""), email = em.value.trim().toLowerCase();
    var ok = true;
    var telOk = digits.length === 11 && digits[2] === "9"; tel.classList.toggle("err", !telOk); ok = ok && telOk;
    var emOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); em.classList.toggle("err", !emOk); ok = ok && emOk;
    esc.classList.toggle("err", !esc.value); ok = ok && !!esc.value;
    msg.classList.remove("show");
    if (!ok) { msg.textContent = !telOk ? "Confira o WhatsApp: DDD + número com 9 dígitos." : !emOk ? "Confira o e-mail." : "Selecione a sua escolaridade."; msg.classList.add("show"); return; }

    /* o motor exige nome: deriva da parte local do e-mail; a Anne pega o nome real depois (mesma regra da página) */
    var nome = (email.split("@")[0] || "").replace(/[0-9]+/g, " ").replace(/[._\-+]+/g, " ").trim()
      .split(/\s+/).filter(Boolean).map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(" ").slice(0, 60);
    if (nome.length < 2) nome = "Concurseiro(a)";

    var a = attr(), utm = {};
    ["utm_source", "utm_medium", "utm_campaign", "utm_term"].forEach(function (k) { if (a[k]) utm[k] = a[k]; });
    if (!utm.utm_source) { utm.utm_source = "portal"; utm.utm_medium = "popup"; utm.utm_campaign = "black-nao-alunos"; }
    utm.utm_content = "popup-site";
    var payload = {
      op: "lead", slug: SLUG, nome: nome, email: email, telefone: digits, escolaridade: "",
      answers: { escolaridade: esc.value }, utm: utm,
      fbclid: a.fbclid || null, fbclid_ts: a.ts || Date.now(), fbp: cookie("_fbp"), fbc: cookie("_fbc"), page_url: location.href
    };
    btn.disabled = true; btn.textContent = "ENVIANDO…";
    fetch(API, { method: "POST", headers: headers(), body: JSON.stringify(payload) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { if (!r.ok) throw new Error(d.error || "erro"); return d; }); })
      .then(function (r) {
        registroId = r.registro_id || null;
        try { if (r.pixel && window.fbq) window.fbq("track", "Lead", {}, { eventID: r.pixel.event_id }); } catch (_) {}
        var dest = r.redirect_url || r.redirect_url_desq || GRUPO;
        document.getElementById("bkpGrupo").href = dest;
        save({ done: true, at: Date.now(), reg: registroId });
        document.getElementById("bkpStep1").style.display = "none";
        document.getElementById("bkpStep2").style.display = "block";
        setTimeout(function () { document.getElementById("bkpBar").style.width = "84%"; }, 150);
      })
      .catch(function (e) {
        btn.disabled = false; btn.innerHTML = "Garantir meu lugar &rarr;";
        msg.textContent = /whatsapp/i.test(e.message) ? "Confira o WhatsApp: DDD + número com 9 dígitos." : "Não conseguimos enviar agora. Tente de novo em instantes.";
        msg.classList.add("show");
      });
  }

  /* ---------- gatilhos ---------- */
  function armar() {
    if (logged() || skipPath() || !podeAbrir()) return;
    var t = setTimeout(abrir, DELAY_MS);
    function onScroll() {
      var h = document.documentElement, pct = (h.scrollTop || document.body.scrollTop) / Math.max(1, h.scrollHeight - h.clientHeight) * 100;
      if (pct >= SCROLL_PCT) { clearTimeout(t); abrir(); window.removeEventListener("scroll", onScroll); }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mouseleave", function (e) { if (e.clientY <= 0) { clearTimeout(t); abrir(); } });
  }
  window.scvpBlackPopup = { open: function () { if (!ov) build(); if (!aberto) { aberto = true; ov.classList.add("on"); document.body.style.overflow = "hidden"; } }, reset: function () { try { localStorage.removeItem(STORE); } catch (_) {} } };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", armar); else armar();
})();
