# Arquitetura técnica

## Stack

React, TypeScript, Vite, roteamento React Router, Supabase JS, validação com schemas tipados, CSS/Tailwind conforme o repositório final, Vercel e GitHub.

## Camadas

```
pages/routes
  ↓
features e componentes
  ↓
hooks/stores/services
  ↓
Supabase client + Edge Functions
  ↓
Postgres/RLS/Storage
```

Separar conteúdo, regras puras, permissões, persistência, UI e analytics. Nunca colocar regra de plano apenas em componente visual.

## Módulos

auth, onboarding, dashboard, master-library, customer-library, recipes, products, menus, public-catalog, favorites, trash, subscriptions, settings e admin.

## Integrações

Mercado Pago somente no servidor/Edge Function para criar cobranças e processar webhooks. Nunca expor segredo no frontend. Google via Supabase Auth. QR Code gerado a partir da URL pública.

## Estados obrigatórios

Loading, vazio, validação, erro recuperável, sucesso, offline/parcial, leitura após expiração e sem permissão.

