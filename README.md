# scvp-frontend-snippets

Snippets de frontend hospedados para as páginas de vendas do portal **Sou Concurseiro e Vou Passar** (Thinkr LMS).

## modal-captacao-lead.js

Modal de captação de lead que intercepta cliques em links de checkout (`pay.hub.la`),
captura **nome + WhatsApp + UTMs** (lidas da URL), dispara um webhook (N8N) e em seguida
redireciona para o checkout da Hubla. Se o webhook falhar ou demorar (timeout 4s), o
redirect acontece mesmo assim — a venda nunca é bloqueada.

### Como usar nas páginas Thinkr

Colar **uma única linha** no final da página, dentro do `<div class="scvp-elite">`:

```html
<script src="https://cdn.jsdelivr.net/gh/fabiomsam-cloud/scvp-frontend-snippets@main/modal-captacao-lead.js" defer></script>
```

### Webhook

- Endpoint: N8N (`webhook2.manager01.scvpgti.com.br`)
- Payload JSON: `name`, `phone`, `whatsapp`, `utm_source/medium/campaign/term/content`, `origin_url`, `page_title`
- **Importante:** o nó Webhook do N8N precisa ter **CORS (Allowed Origins)** habilitado
  para o domínio `souconcurseiroevoupassar.com`, senão o navegador bloqueia o POST.

## popup-black-site.js — pop-up da Black p/ VISITANTES (não logados)

Pop-up de cadastro na live "Black · A Revolução do Estudo" (10/11/2026) em **toda página do portal**
para quem **não está logado** (`window.thinkrLogged != 1`). Abre uma vez (7 s, 30% de rolagem ou
intenção de saída); fechou → volta em 3 dias; cadastrou → nunca mais (localStorage `scvp_black_pop_v1`).
Campos: WhatsApp + e-mail + escolaridade → edge `gerador-paginas` (slug `black-revolucao-nao-alunos`,
`utm_content=popup-site`) → passo 2 dentro do pop-up com o botão do grupo (Sendflow NÃO ALUNOS).
Fica de fora em `/admin`, `/alunos`, `/cursos/ver/` (páginas de venda), `/checkout`, `/carrinho` — lista `SKIP_PATHS`.
Console: `scvpBlackPopup.open()` abre na hora · `scvpBlackPopup.reset()` zera a memória local.

## popup-black-alunos.js — pop-up da Black SÓ p/ ALUNOS LOGADOS

Mesmo visual, só roda com `window.thinkrLogged == 1` (o template Thinkr expõe `thinkrLogged`,
`thinkrName`, `thinkrEmail`). Nome e e-mail vêm do login; o aluno informa só o WhatsApp.
Live dos alunos 27/10/2026 20h Brasília. Slug `black-revolucao-alunos` (sem pixel, `aluno_mentoria=sim`,
`utm_content=popup-alunos`) → grupo Sendflow ALUNOS. Abre em TODA página até cadastrar (fechar não desliga); cadastrou → nunca mais
(`scvp_black_pop_alunos_v1`). Copy não cita produto/preço (regra do agente black_alunos).
Console: `scvpBlackPopupAlunos.open()` · `scvpBlackPopupAlunos.reset()`.

### Instalação (loader global do template Thinkr, junto do modal do checkout)

```html
<script src="https://cdn.jsdelivr.net/gh/fabiomsam-cloud/scvp-frontend-snippets@<commit>/popup-black-site.js" defer></script>
<script src="https://cdn.jsdelivr.net/gh/fabiomsam-cloud/scvp-frontend-snippets@<commit>/popup-black-alunos.js" defer></script>
```

Pinar pelo commit (jsDelivr): mudou o script = trocar o hash no template. Para tirar a Black do ar, basta remover as duas linhas.
