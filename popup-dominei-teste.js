/* DOMINEI · TESTE DE 48 HORAS — pop-up SÓ para ALUNOS LOGADOS, só na ÁREA DO ALUNO do portal Thinkr
 * (souconcurseiroevoupassar.com). Aprovado pelo Fábio em 28/10/2026. Carregado pelo loader global do template.
 *
 * Regras:
 *  - Só roda com window.thinkrLogged == 1 e só nas páginas que começam por ONLY_PATHS (área do aluno)
 *  - Antes de abrir pergunta à edge dominei-popup (Data Core) pelo e-mail do login se pode mostrar:
 *    NUNCA para quem comprou a Tríade, quem está no piloto de 48 h, quem já tem conta no Dominei ou já pegou o teste.
 *    Se a consulta falhar ou demorar → NÃO abre (nunca mostrar para comprador por erro)
 *  - Abre 2 s depois de cada página até o aluno se cadastrar; fechar não desliga (pedido do Fábio)
 *  - Cadastro: só o WhatsApp (nome e e-mail vêm do login). A edge cria o convite PESSOAL no Dominei (48 h a partir
 *    do cadastro) e devolve o link; a Anne coach manda as boas-vindas no WhatsApp em até 10 min
 */
(function () {
  "use strict";
  if (window.__scvpDomineiTeste) return; window.__scvpDomineiTeste = true;

  var API = "https://dqpxugdhlgafvddavzzp.supabase.co/functions/v1/dominei-popup";
  var IMG = "https://revolucaodoestudo.com.br/assets/dominei-teste-48h.jpg";
  var STORE = "scvp_dominei_teste_v1";
  var DELAY_MS = 2000;
  var ONLY_PATHS = window.scvpDomineiPaths || ["/alunos"];

  function logged() { return String(window.thinkrLogged || "0") === "1"; }
  function naArea() { var p = location.pathname; for (var i = 0; i < ONLY_PATHS.length; i++) if (p.indexOf(ONLY_PATHS[i]) === 0) return true; return false; }
  function store() { try { return JSON.parse(localStorage.getItem(STORE) || "null") || {}; } catch (_) { return {}; } }
  function save(o) { try { localStorage.setItem(STORE, JSON.stringify(o)); } catch (_) {} }
  function nomeLogin() { return String(window.thinkrName || "").trim().slice(0, 120); }
  function emailLogin() { return String(window.thinkrEmail || "").trim().toLowerCase().slice(0, 160); }
  function primeiroNome() { var n = nomeLogin().split(/\s+/)[0] || ""; return n ? n.charAt(0).toUpperCase() + n.slice(1).toLowerCase() : ""; }
  var RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  var CSS = '@import url("https://fonts.googleapis.com/css2?family=Saira:wght@600;700;800&family=Figtree:wght@400;500;600;700&display=swap");' +
  '.dmt-ov{position:fixed;inset:0;background:rgba(3,6,8,.8);backdrop-filter:blur(3px);z-index:2147483000;display:none;align-items:center;justify-content:center;padding:16px;font-family:Figtree,system-ui,sans-serif}' +
  '.dmt-ov.on{display:flex}' +
  '@keyframes dmtUp{from{transform:translateY(24px);opacity:0}to{transform:none;opacity:1}}' +
  '.dmt{position:relative;width:100%;max-width:420px;max-height:calc(100vh - 32px);overflow:auto;background:#0b1116;color:#f2f6f4;border:1px solid rgba(46,240,160,.22);border-radius:20px;box-shadow:0 30px 80px rgba(0,0,0,.6),0 0 60px rgba(46,240,160,.14);animation:dmtUp .32s ease;box-sizing:border-box;text-align:center}' +
  '.dmt *{box-sizing:border-box}' +
  '.dmt-img{display:block;width:100%;height:auto;aspect-ratio:1/1;object-fit:cover;border-radius:19px 19px 0 0}' +
  '.dmt-x{position:absolute;top:10px;right:10px;width:34px;height:34px;border-radius:50%;border:1px solid rgba(255,255,255,.18);background:rgba(0,0,0,.45);color:#e6ece9;font-size:22px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;z-index:2}' +
  '.dmt-in{padding:18px 22px 20px}' +
  '.dmt h3{font-family:Saira,system-ui,sans-serif;font-weight:800;font-size:22px;line-height:1.15;margin:0 0 8px;color:#fff}' +
  '.dmt h3 em{font-style:normal;color:#2ef0a0}' +
  '.dmt p{margin:0 0 14px;font-size:14.5px;line-height:1.5;color:#c3cdc8}' +
  '.dmt label{display:block;text-align:left;font-size:13px;font-weight:600;color:#c3cdc8;margin:0 0 6px}' +
  '.dmt input{width:100%;height:46px;padding:0 14px;border-radius:12px;border:1px solid rgba(255,255,255,.16);background:#131b21;color:#fff;font-family:inherit;font-size:15px;margin:0 0 12px;-webkit-appearance:none;appearance:none;outline:0}' +
  '.dmt input::placeholder{color:#82908a}.dmt input:focus{border-color:#2ef0a0;box-shadow:0 0 0 3px rgba(46,240,160,.18)}' +
  '.dmt .err{border-color:#e5484d!important}' +
  '.dmt-btn{width:100%;min-height:50px;border:0;border-radius:999px;background:#2ef0a0;color:#06110c;font-family:Saira,system-ui,sans-serif;font-weight:800;font-size:15px;letter-spacing:.04em;text-transform:uppercase;cursor:pointer;box-shadow:0 8px 28px rgba(46,240,160,.35);display:flex;align-items:center;justify-content:center;gap:8px;text-decoration:none;padding:0 18px}' +
  '.dmt-btn:hover{background:#5cf5b8}.dmt-btn:disabled{opacity:.6;cursor:wait}' +
  '.dmt-msg{display:none;color:#ff8f93;font-size:13px;margin:0 0 10px}.dmt-msg.show{display:block}' +
  '.dmt-note{font-size:12px;color:#82908a;margin:12px 0 0;line-height:1.5}' +
  '@media (max-width:420px){.dmt h3{font-size:20px}.dmt-in{padding:16px 16px 18px}}';

  function html() {
    var pn = primeiroNome();
    return '<div class="dmt" role="dialog" aria-modal="true" aria-labelledby="dmtTitle">' +
    '<button type="button" class="dmt-x" id="dmtX" aria-label="Fechar">&times;</button>' +
    '<img class="dmt-img" src="' + IMG + '" alt="Dominei: seu estudo ganhou um cérebro">' +
    '<div class="dmt-in" id="dmtStep1">' +
      '<h3 id="dmtTitle">' + (pn ? pn + ", teste" : "Teste") + ' o Dominei <em>por 48 horas.</em></h3>' +
      '<p>Exclusivo para alunos: descubra o que você já domina e onde precisa focar no seu concurso.</p>' +
      '<form id="dmtForm" novalidate>' +
        '<label for="dmtTel">Seu WhatsApp</label><input id="dmtTel" name="telefone" type="tel" inputmode="numeric" autocomplete="tel" placeholder="(92) 99999-9999" maxlength="15">' +
        '<div class="dmt-msg" id="dmtMsg"></div>' +
        '<button type="submit" class="dmt-btn" id="dmtBtn">Quero testar o Dominei &rarr;</button>' +
      '</form>' +
      '<p class="dmt-note">Teste com o e-mail da sua conta: ' + emailLogin() + '</p>' +
    '</div>' +
    '<div class="dmt-in" id="dmtStep2" style="display:none">' +
      '<h3>Pronto! Seu teste de 48 horas <em>está liberado.</em> 🎉</h3>' +
      '<a class="dmt-btn" id="dmtLink" href="https://dominei.app" target="_blank" rel="noopener">Criar minha conta no Dominei &rarr;</a>' +
      '<p class="dmt-note">Também te mandei o link no WhatsApp.</p>' +
    '</div></div>';
  }

  var ov, aberto = false;
  function build() {
    var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);
    ov = document.createElement("div"); ov.className = "dmt-ov"; ov.innerHTML = html();
    document.body.appendChild(ov);
    document.getElementById("dmtX").addEventListener("click", fechar);
    ov.addEventListener("click", function (e) { if (e.target === ov) fechar(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && aberto) fechar(); });
    var tel = document.getElementById("dmtTel");
    tel.addEventListener("input", function () {
      var d = tel.value.replace(/\D/g, "").slice(0, 11), o = "";
      if (d.length > 0) o = "(" + d.slice(0, 2); if (d.length >= 3) o += ") " + d.slice(2, 7); if (d.length >= 8) o += "-" + d.slice(7);
      tel.value = o;
    });
    document.getElementById("dmtForm").addEventListener("submit", enviar);
  }
  function abrir() {
    if (aberto || store().done) return;
    if (!ov) build();
    aberto = true; ov.classList.add("on"); document.body.style.overflow = "hidden";
  }
  function fechar() { if (!aberto) return; aberto = false; ov.classList.remove("on"); document.body.style.overflow = ""; }

  function enviar(ev) {
    ev.preventDefault();
    var tel = document.getElementById("dmtTel"), btn = document.getElementById("dmtBtn"), msg = document.getElementById("dmtMsg");
    var digits = tel.value.replace(/\D/g, "");
    var telOk = digits.length === 11 && digits[2] === "9"; tel.classList.toggle("err", !telOk);
    msg.classList.remove("show");
    if (!telOk) { msg.textContent = "Confira o WhatsApp: DDD + número com 9 dígitos."; msg.classList.add("show"); return; }
    btn.disabled = true; btn.textContent = "LIBERANDO…";
    fetch(API, { method: "POST", headers: { "Content-Type": "application/json" },
                 body: JSON.stringify({ email: emailLogin(), nome: nomeLogin(), whatsapp: digits }) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { if (!r.ok || !d.ok) throw new Error(d.erro || d.motivo || "erro"); return d; }); })
      .then(function (d) {
        save({ done: true, at: Date.now() });
        document.getElementById("dmtLink").href = d.link;
        document.getElementById("dmtStep1").style.display = "none";
        document.getElementById("dmtStep2").style.display = "block";
      })
      .catch(function (e) {
        btn.disabled = false; btn.innerHTML = "Quero testar o Dominei &rarr;";
        if (/comprou|piloto|tem_conta/.test(e.message)) { save({ done: true, at: Date.now(), motivo: e.message }); fechar(); return; }
        msg.textContent = /whatsapp/i.test(e.message) ? "Confira o WhatsApp: DDD + número com 9 dígitos." : "Não conseguimos liberar agora. Tente de novo em instantes.";
        msg.classList.add("show");
      });
  }

  /* pode mostrar? (comprador, piloto, conta no Dominei ou já cadastrado = não). Falhou/demorou = NÃO abre. */
  function podeMostrar(cb) {
    var email = emailLogin();
    if (!RE_EMAIL.test(email) || typeof fetch !== "function") { cb(false); return; }
    var feito = false, t = setTimeout(function () { if (!feito) { feito = true; cb(false); } }, 3000);
    fetch(API + "?op=elegivel&email=" + encodeURIComponent(email))
      .then(function (r) { return r.json(); })
      .then(function (d) { if (feito) return; feito = true; clearTimeout(t); cb(!!(d && d.mostrar)); })
      .catch(function () { if (feito) return; feito = true; clearTimeout(t); cb(false); });
  }

  function armar() {
    if (!logged() || !naArea() || store().done) return;
    podeMostrar(function (ok) {
      if (!ok) return;
      setTimeout(abrir, DELAY_MS);
    });
  }
  window.scvpDomineiTeste = { open: function () { if (!ov) build(); aberto = true; ov.classList.add("on"); }, reset: function () { try { localStorage.removeItem(STORE); } catch (_) {} } };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", armar); else armar();
})();
