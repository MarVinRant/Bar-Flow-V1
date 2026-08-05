# Bar Flow — Documento Mestre Consolidado

Este arquivo consolida a visão, escopo, regras, planos, permissões, fluxos, arquitetura, segurança, biblioteca, cobrança, administração, implementação e aceite descritos nos documentos numerados deste pacote.

A fonte detalhada permanece nos arquivos `00_MASTER_BRIEFING.md` a `20_STATUS.md`. Para executar, leia o `README.md` e siga a ordem oficial. O Bar Flow é um SaaS multi-tenant brasileiro para operação de bebidas, com React + TypeScript + Vite, Supabase, Mercado Pago, Vercel e GitHub. O escopo está congelado: construir o núcleo Bronze primeiro, mantendo Silver/Gold habilitáveis por configuração, sem misturar Content Studio ou identidade RanTech ao produto.

## Resumo operacional

Cadastro e autenticação por e-mail/senha e Google; onboarding; grupo/estabelecimento; Dashboard; Biblioteca Mestre; Meu Acervo; receitas, produtos e preparos; favoritos; cardápio/catálogo público; link, QR Code e WhatsApp; configurações; assinaturas; painel administrativo; RLS, auditoria, Storage, exportação CSV/JSON e lixeira de 30 dias.

As regras essenciais são: cópias mestres independentes; receitas e produtos separados; limites validados em frontend/backend; downgrade sem exclusão silenciosa; conteúdo restrito com maioridade; acesso público sem carrinho; e nenhuma funcionalidade fora do escopo aprovado.

## Diretriz para o Codex

Implemente em fases, preserve o repositório, mantenha regras fora da UI, aplique RLS em todas as tabelas, não exponha segredos e valide cada fase com lint, typecheck, testes, build, acessibilidade, responsividade, Lighthouse e smoke tests. Registre bloqueios e mudanças em `20_STATUS.md`.

