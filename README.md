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
