/* DOMINEI · PÁGINA DE VENDAS — pop-up SÓ para ALUNOS LOGADOS, só na ÁREA DO ALUNO do portal Thinkr
 * (souconcurseiroevoupassar.com). Pedido do Fábio em 11/11/2026. Carregado pelo loader global do template.
 *
 * Regras:
 *  - Só roda com window.thinkrLogged == 1 e só nas páginas que começam por ONLY_PATHS (área do aluno)
 *  - Antes de abrir pergunta à edge dominei-popup (Data Core), pelo e-mail do login, se pode mostrar:
 *    NUNCA para quem já tem acesso vigente ao Dominei (Tríade, combo da Black ou compra avulsa) nem para quem já se
 *    cadastrou neste pop-up. Se a consulta falhar ou demorar → NÃO abre
 *  - "Chato" de propósito (pedido do Fábio: a condição acaba com a Black Friday): abre 2 s depois de cada página
 *    da área do aluno até o aluno se cadastrar; fechar não desliga
 *  - Cadastro: só o WhatsApp (nome e e-mail vêm do login). Ao enviar, a página de vendas do Dominei abre em OUTRA
 *    aba (a aula fica aberta) com a origem marcada, e o cadastro é gravado no Data Core. Sem sequência da Anne.
 *  - ?popdominei=venda na URL abre só para VISUALIZAR
 */
(function () {
  "use strict";
  if (window.__scvpDomineiVenda) return; window.__scvpDomineiVenda = true;

  var API = "https://dqpxugdhlgafvddavzzp.supabase.co/functions/v1/dominei-popup";
  /* a imagem mora ao lado deste arquivo, na mesma versão publicada */
  var IMG = (function () { try { return String(document.currentScript.src).replace(/[^\/]+$/, "popup-dominei-venda.jpg"); } catch (_) { return "https://cdn.jsdelivr.net/gh/fabiomsam-cloud/scvp-frontend-snippets@main/popup-dominei-venda.jpg"; } })();
  var PAGINA = "https://dominei.app/conheca/?utm_source=think&utm_medium=popup&utm_campaign=dominei-avulso-alunos&utm_content=popup-area-aluno";
  var STORE = "scvp_dominei_venda_v1";
  var DELAY_MS = 2000;
  /* área do aluno do Thinkr = /cursos/interna/... (confirmado pelo Fábio 28/10); /alunos fica por compatibilidade */
  var ONLY_PATHS = window.scvpDomineiPaths || ["/cursos/interna", "/alunos"];
  /* ?popdominei=venda na URL abre o pop-up só para VISUALIZAR (ignora as regras de quem pode ver) */
  var VER = /[?&]popdominei=venda\b/.test(location.search);

  function logged() { return String(window.thinkrLogged || "0") === "1"; }
  function naArea() { var p = location.pathname; for (var i = 0; i < ONLY_PATHS.length; i++) if (p.indexOf(ONLY_PATHS[i]) === 0) return true; return false; }
  function store() { try { return JSON.parse(localStorage.getItem(STORE) || "null") || {}; } catch (_) { return {}; } }
  function save(o) { try { localStorage.setItem(STORE, JSON.stringify(o)); } catch (_) {} }
  function nomeLogin() { return String(window.thinkrName || "").trim().slice(0, 120); }
  function emailLogin() { return String(window.thinkrEmail || "").trim().toLowerCase().slice(0, 160); }
  function primeiroNome() { var n = nomeLogin().split(/\s+/)[0] || ""; return n ? n.charAt(0).toUpperCase() + n.slice(1).toLowerCase() : ""; }
  var RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  var CSS = '@import url("https://fonts.googleapis.com/css2?family=Saira:wght@600;700;800&family=Figtree:wght@400;500;600;700&display=swap");' +
  '.dmv-ov{position:fixed;inset:0;background:rgba(3,6,8,.8);backdrop-filter:blur(3px);z-index:2147483000;display:none;align-items:center;justify-content:center;padding:16px;font-family:Figtree,system-ui,sans-serif}' +
  '.dmv-ov.on{display:flex}' +
  '@keyframes dmvUp{from{transform:translateY(24px);opacity:0}to{transform:none;opacity:1}}' +
  '.dmv{position:relative;width:100%;max-width:420px;max-height:calc(100vh - 32px);overflow:auto;background:#0b1116;color:#f2f6f4;border:1px solid rgba(46,240,160,.22);border-radius:20px;box-shadow:0 30px 80px rgba(0,0,0,.6),0 0 60px rgba(46,240,160,.14);animation:dmvUp .32s ease;box-sizing:border-box;text-align:center}' +
  '.dmv *{box-sizing:border-box}' +
  '.dmv-img{display:block;width:100%;height:auto;aspect-ratio:710/454;object-fit:cover;border-radius:19px 19px 0 0}' +
  '.dmv-x{position:absolute;top:10px;right:10px;width:34px;height:34px;border-radius:50%;border:1px solid rgba(255,255,255,.18);background:rgba(0,0,0,.45);color:#e6ece9;font-size:22px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;z-index:2}' +
  '.dmv-in{padding:18px 22px 20px}' +
  '.dmv h3{font-family:Saira,system-ui,sans-serif;font-weight:800;font-size:22px;line-height:1.15;margin:0 0 8px;color:#fff}' +
  '.dmv h3 em{font-style:normal;color:#2ef0a0}' +
  '.dmv p{margin:0 0 14px;font-size:14.5px;line-height:1.5;color:#c3cdc8}' +
  '.dmv label{display:block;text-align:left;font-size:13px;font-weight:600;color:#c3cdc8;margin:0 0 6px}' +
  '.dmv input{width:100%;height:46px;padding:0 14px;border-radius:12px;border:1px solid rgba(255,255,255,.16);background:#131b21;color:#fff;font-family:inherit;font-size:15px;margin:0 0 12px;-webkit-appearance:none;appearance:none;outline:0}' +
  '.dmv input::placeholder{color:#82908a}.dmv input:focus{border-color:#2ef0a0;box-shadow:0 0 0 3px rgba(46,240,160,.18)}' +
  '.dmv .err{border-color:#e5484d!important}' +
  '.dmv-btn{width:100%;min-height:50px;border:0;border-radius:999px;background:#2ef0a0;color:#06110c;font-family:Saira,system-ui,sans-serif;font-weight:800;font-size:15px;letter-spacing:.04em;text-transform:uppercase;cursor:pointer;box-shadow:0 8px 28px rgba(46,240,160,.35);display:flex;align-items:center;justify-content:center;gap:8px;text-decoration:none;padding:0 18px}' +
  '.dmv-btn:hover{background:#5cf5b8}.dmv-btn:disabled{opacity:.6;cursor:wait}' +
  '.dmv-msg{display:none;color:#ff8f93;font-size:13px;margin:0 0 10px}.dmv-msg.show{display:block}' +
  '.dmv-note{font-size:12px;color:#82908a;margin:12px 0 0;line-height:1.5}' +
  '@media (max-width:420px){.dmv h3{font-size:20px}.dmv-in{padding:16px 16px 18px}}';

  function html() {
    var pn = primeiroNome();
    return '<div class="dmv" role="dialog" aria-modal="true" aria-labelledby="dmvTitle">' +
    '<button type="button" class="dmv-x" id="dmvX" aria-label="Fechar">&times;</button>' +
    '<img class="dmv-img" src="' + IMG + '" alt="Cérebro do Dominei com os temas do edital acesos">' +
    '<div class="dmv-in" id="dmvStep1">' +
      '<h3 id="dmvTitle">' + (pn ? pn + ", saiba" : "Saiba") + ' o que você <em>já domina</em> do seu concurso.</h3>' +
      '<p>O Dominei mostra, em um cérebro virtual, o que você já domina do edital e o que merece a sua atenção. Condição especial de Black Friday: a partir de 12x de R$ 59,73.</p>' +
      '<form id="dmvForm" novalidate>' +
        '<label for="dmvTel">Seu WhatsApp</label><input id="dmvTel" name="telefone" type="tel" inputmode="numeric" autocomplete="tel" placeholder="(92) 99999-9999" maxlength="15">' +
        '<div class="dmv-msg" id="dmvMsg"></div>' +
        '<button type="submit" class="dmv-btn" id="dmvBtn">Quero conhecer o Dominei &rarr;</button>' +
      '</form>' +
      '<p class="dmv-note">A página do Dominei abre em outra aba. Sua aula continua aqui.</p>' +
    '</div>' +
    '<div class="dmv-in" id="dmvStep2" style="display:none">' +
      '<h3>Abrimos o Dominei <em>em outra aba.</em></h3>' +
      '<a class="dmv-btn" id="dmvLink" href="' + PAGINA + '" target="_blank" rel="noopener">Abrir a página do Dominei &rarr;</a>' +
      '<p class="dmv-note">Se a aba não abriu, toque no botão acima.</p>' +
    '</div></div>';
  }

  var ov, aberto = false;
  function build() {
    var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);
    ov = document.createElement("div"); ov.className = "dmv-ov"; ov.innerHTML = html();
    document.body.appendChild(ov);
    document.getElementById("dmvX").addEventListener("click", fechar);
    ov.addEventListener("click", function (e) { if (e.target === ov) fechar(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && aberto) fechar(); });
    var tel = document.getElementById("dmvTel");
    tel.addEventListener("input", function () {
      var d = tel.value.replace(/\D/g, "").slice(0, 11), o = "";
      if (d.length > 0) o = "(" + d.slice(0, 2); if (d.length >= 3) o += ") " + d.slice(2, 7); if (d.length >= 8) o += "-" + d.slice(7);
      tel.value = o;
    });
    document.getElementById("dmvForm").addEventListener("submit", enviar);
  }
  function abrir() {
    if (aberto || store().done) return;
    if (!ov) build();
    aberto = true; ov.classList.add("on"); document.body.style.overflow = "hidden";
    /* conta que o aluno viu (para medir quantos viram × quantos se cadastraram); falha aqui não importa */
    try { fetch(API + "?op=venda_visto", { method: "POST", headers: { "Content-Type": "application/json" }, keepalive: true,
                 body: JSON.stringify({ email: emailLogin(), pagina: location.pathname.slice(0, 200) }) }).catch(function () {}); } catch (_) {}
  }
  function fechar() { if (!aberto) return; aberto = false; ov.classList.remove("on"); document.body.style.overflow = ""; }

  function enviar(ev) {
    ev.preventDefault();
    var tel = document.getElementById("dmvTel"), btn = document.getElementById("dmvBtn"), msg = document.getElementById("dmvMsg");
    var digits = tel.value.replace(/\D/g, "");
    var telOk = digits.length === 11 && digits[2] === "9"; tel.classList.toggle("err", !telOk);
    msg.classList.remove("show");
    if (!telOk) { msg.textContent = "Confira o WhatsApp: DDD + número com 9 dígitos."; msg.classList.add("show"); return; }
    /* a aba abre JÁ, dentro do toque do aluno (depois de uma espera o navegador bloquearia) */
    try { window.open(PAGINA, "_blank", "noopener"); } catch (_) {}
    btn.disabled = true; btn.textContent = "ABRINDO…";
    document.getElementById("dmvStep1").style.display = "none";
    document.getElementById("dmvStep2").style.display = "block";
    fetch(API + "?op=venda", { method: "POST", headers: { "Content-Type": "application/json" }, keepalive: true,
                 body: JSON.stringify({ email: emailLogin(), nome: nomeLogin(), whatsapp: digits, pagina: location.pathname.slice(0, 200) }) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { if (r.ok && d.ok) save({ done: true, at: Date.now() }); }); })
      .catch(function () { /* não gravou: o pop-up volta na próxima página e o aluno pode enviar de novo */ });
  }

  /* pode mostrar? (acesso vigente ao Dominei ou já cadastrado = não). Falhou/demorou = NÃO abre. */
  function podeMostrar(cb) {
    var email = emailLogin();
    if (!RE_EMAIL.test(email) || typeof fetch !== "function") { cb(false); return; }
    var feito = false, t = setTimeout(function () { if (!feito) { feito = true; cb(false); } }, 3000);
    fetch(API + "?op=venda_elegivel&email=" + encodeURIComponent(email))
      .then(function (r) { return r.json(); })
      .then(function (d) { if (feito) return; feito = true; clearTimeout(t); cb(!!(d && d.mostrar)); })
      .catch(function () { if (feito) return; feito = true; clearTimeout(t); cb(false); });
  }

  function armar() {
    if (VER) { setTimeout(function () { if (!ov) build(); aberto = true; ov.classList.add("on"); }, 300); return; }
    if (!logged() || !naArea() || store().done) return;
    podeMostrar(function (ok) {
      if (!ok) return;
      setTimeout(abrir, DELAY_MS);
    });
  }
  window.scvpDomineiVenda = { open: function () { if (!ov) build(); aberto = true; ov.classList.add("on"); }, reset: function () { try { localStorage.removeItem(STORE); } catch (_) {} } };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", armar); else armar();
})();
