(function() {
  var WEBHOOK = 'https://webhook2.manager01.scvpgti.com.br/webhook/2d9b0f1a-acc2-4111-abf4-2b2b4a110ad2';

  // ---- 1) Injeta CSS no head ----
  var cssEl = document.createElement('style');
  cssEl.textContent = '.scvpM-ov{display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.65);z-index:99999;justify-content:center;align-items:center;padding:20px;font-family:Segoe UI,Tahoma,Geneva,Verdana,sans-serif}.scvpM-ov.scvpM-on{display:flex}@keyframes scvpMup{from{transform:translateY(30px);opacity:0}to{transform:translateY(0);opacity:1}}.scvpM-box{background:#fff;border-radius:16px;max-width:460px;width:100%;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.4);animation:scvpMup .3s ease;box-sizing:border-box}.scvpM-box *{box-sizing:border-box}.scvpM-head{background:linear-gradient(135deg,#1a5632,#2d8a4e);color:#fff;padding:24px 28px;text-align:center;position:relative}.scvpM-head h3{font-size:1.3rem;font-weight:800;margin:0 0 6px;color:#fff;line-height:1.3}.scvpM-head p{font-size:14px;opacity:.9;margin:0;line-height:1.4;color:#fff}.scvpM-x{position:absolute;top:12px;right:14px;background:rgba(255,255,255,.2);border:0;color:#fff;width:30px;height:30px;border-radius:50%;cursor:pointer;font-size:20px;display:flex;align-items:center;justify-content:center;padding:0;line-height:1}.scvpM-body{padding:28px}.scvpM-body label{display:block;font-size:13px;font-weight:600;color:#1a1a2e;margin:0 0 6px}.scvpM-body input{width:100%;padding:12px 14px;border:2px solid #e0e0e0;border-radius:8px;font-size:15px;color:#1a1a2e;background:#fff;font-family:inherit;margin-bottom:14px;-webkit-appearance:none}.scvpM-body input:focus{outline:0;border-color:#1a5632}.scvpM-body input.scvpM-err{border-color:#c0392b;background:#fff5f5}.scvpM-btn{width:100%;background:#25D366;color:#fff;border:0;padding:14px;border-radius:8px;font-size:16px;font-weight:700;cursor:pointer;margin-top:4px;box-shadow:0 4px 16px rgba(37,211,102,.25);font-family:inherit}.scvpM-btn:disabled{background:#95d4ad;cursor:not-allowed}.scvpM-note{text-align:center;font-size:11px;color:#888;margin:14px 0 0;line-height:1.5}.scvpM-spin{display:inline-block;width:16px;height:16px;border:2px solid #fff;border-top-color:transparent;border-radius:50%;animation:scvpMsp .7s linear infinite;vertical-align:middle;margin-right:8px}@keyframes scvpMsp{to{transform:rotate(360deg)}}';
  document.head.appendChild(cssEl);

  // ---- 2) Injeta HTML do modal no body ----
  function buildModal() {
    var wrap = document.createElement('div');
    wrap.innerHTML = '<div class="scvpM-ov" id="scvpMov"><div class="scvpM-box"><div class="scvpM-head"><button type="button" class="scvpM-x" id="scvpMxBtn" aria-label="Fechar">&times;</button><h3>Falta pouco para garantir sua vaga!</h3><p>Preencha seus dados para continuar para o checkout seguro</p></div><div class="scvpM-body"><form id="scvpMform" novalidate><label for="scvpMnome">Nome completo *</label><input type="text" id="scvpMnome" required autocomplete="name" placeholder="Seu nome completo"><label for="scvpMemail">E-mail *</label><input type="email" id="scvpMemail" required autocomplete="email" inputmode="email" placeholder="seu@email.com"><label for="scvpMwhats">WhatsApp (com DDD) *</label><input type="tel" id="scvpMwhats" required autocomplete="tel" placeholder="(92) 99999-9999" maxlength="15" inputmode="numeric"><button type="submit" class="scvpM-btn" id="scvpMbtn">Continuar para o checkout &rarr;</button><p class="scvpM-note">&#128274; Seus dados estao protegidos. Ao continuar, voce concorda em receber contato da nossa equipe.</p></form></div></div></div>';
    document.body.appendChild(wrap.firstElementChild);
  }

  // ---- 3) Helpers ----
  var checkoutUrl = null;

  function getUtms() {
    var p = new URLSearchParams(window.location.search);
    return {
      utm_source: p.get('utm_source') || '',
      utm_medium: p.get('utm_medium') || '',
      utm_campaign: p.get('utm_campaign') || '',
      utm_term: p.get('utm_term') || '',
      utm_content: p.get('utm_content') || ''
    };
  }

  function maskPhone(v) {
    v = v.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);
    if (v.length > 10) return v.replace(/(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
    if (v.length > 6) return v.replace(/(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
    if (v.length > 2) return v.replace(/(\d{2})(\d{0,5}).*/, '($1) $2');
    if (v.length > 0) return v.replace(/(\d{0,2}).*/, '($1');
    return v;
  }

  function openModal() {
    var m = document.getElementById('scvpMov');
    if (!m) return;
    m.classList.add('scvpM-on');
    document.body.style.overflow = 'hidden';
    setTimeout(function() {
      var n = document.getElementById('scvpMnome');
      if (n) n.focus();
    }, 100);
  }

  function closeModal() {
    var m = document.getElementById('scvpMov');
    if (!m) return;
    m.classList.remove('scvpM-on');
    document.body.style.overflow = '';
    var b = document.getElementById('scvpMbtn');
    if (b) { b.disabled = false; b.innerHTML = 'Continuar para o checkout &rarr;'; }
  }

  function submitLead(e) {
    if (e) e.preventDefault();
    var n = document.getElementById('scvpMnome');
    var em = document.getElementById('scvpMemail');
    var w = document.getElementById('scvpMwhats');
    var b = document.getElementById('scvpMbtn');
    n.classList.remove('scvpM-err');
    em.classList.remove('scvpM-err');
    w.classList.remove('scvpM-err');
    var valid = true;
    if (!n.value.trim() || n.value.trim().split(/\s+/).length < 2) { n.classList.add('scvpM-err'); valid = false; }
    var email = em.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { em.classList.add('scvpM-err'); valid = false; }
    var digits = w.value.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 11) { w.classList.add('scvpM-err'); valid = false; }
    if (!valid) return false;

    b.disabled = true;
    b.innerHTML = '<span class="scvpM-spin"></span>Enviando...';

    var u = getUtms();
    var payload = {
      name: n.value.trim(),
      email: email,
      phone: digits,
      whatsapp: digits,
      utm_source: u.utm_source,
      utm_medium: u.utm_medium,
      utm_campaign: u.utm_campaign,
      utm_term: u.utm_term,
      utm_content: u.utm_content,
      origin_url: window.location.href,
      page_title: document.title
    };

    // Pre-preenche o checkout da Hubla com os dados capturados (name, email, phonenumber)
    var prefill = '';
    if (checkoutUrl) {
      prefill = (checkoutUrl.indexOf('?') === -1 ? '?' : '&') +
        'name=' + encodeURIComponent(n.value.trim()) +
        '&email=' + encodeURIComponent(email) +
        '&phonenumber=' + encodeURIComponent('+55' + digits);
    }

    function go() {
      if (checkoutUrl) { window.location.href = checkoutUrl + prefill; }
      else { closeModal(); }
    }

    var t = setTimeout(go, 4000);
    fetch(WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      mode: 'cors',
      keepalive: true
    })
    .then(function() { clearTimeout(t); go(); })
    .catch(function() { clearTimeout(t); go(); });

    return false;
  }

  // ---- 4) Inicializacao ----
  function init() {
    buildModal();

    // Intercepta cliques em links para pay.hub.la
    document.addEventListener('click', function(e) {
      var a = e.target.closest('a');
      if (!a || !a.href) return;
      if (a.href.indexOf('pay.hub.la') === -1) return;
      e.preventDefault();
      e.stopPropagation();
      // Preserva as UTMs do visitante no redirect pro checkout da Hubla
      var href = a.href;
      var qs = window.location.search;
      if (qs && qs.length > 1) {
        href += (href.indexOf('?') === -1 ? '?' : '&') + qs.substring(1);
      }
      setTimeout(function() {
        checkoutUrl = href;
        openModal();
      }, 10);
    }, true);

    // Botao fechar
    var x = document.getElementById('scvpMxBtn');
    if (x) x.addEventListener('click', closeModal);

    // Clicar fora fecha
    var ov = document.getElementById('scvpMov');
    if (ov) ov.addEventListener('click', function(e) { if (e.target === ov) closeModal(); });

    // Mascara WhatsApp
    var ww = document.getElementById('scvpMwhats');
    if (ww) ww.addEventListener('input', function(e) { e.target.value = maskPhone(e.target.value); });

    // Submit
    var ff = document.getElementById('scvpMform');
    if (ff) ff.addEventListener('submit', submitLead);

    // ESC fecha
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        var m = document.getElementById('scvpMov');
        if (m && m.classList.contains('scvpM-on')) closeModal();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
