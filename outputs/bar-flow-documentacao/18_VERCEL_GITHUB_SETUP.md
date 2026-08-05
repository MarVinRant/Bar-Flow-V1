# GitHub e Vercel

## GitHub

Repositório privado, branch principal protegida, PR obrigatório, checks de lint/typecheck/test/build e revisão antes de merge. Commits pequenos e mensagens claras. Não versionar `.env`.

## Vercel

Conectar repositório, configurar Preview/Production, variáveis por ambiente, domínio somente quando aprovado e build com `npm run build`. Supabase e Mercado Pago devem ter URLs de callback/webhook corretas por ambiente.

## Checklist de deploy

- Build limpo.
- Migrations aplicadas.
- RLS verificado.
- Redirects Auth verificados.
- Webhook Mercado Pago validado.
- Página pública, QR e WhatsApp testados.
- Lighthouse e smoke test concluídos.

