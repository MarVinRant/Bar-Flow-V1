# Bar Flow

SaaS multi-tenant para organizar receitas, produtos, cardápios e a operação de bebidas.

## Estado atual

A V1 está sendo construída nesta base com:

- React + TypeScript + Vite/Vinext;
- Dashboard, Biblioteca Mestre, Meu Acervo, cardápio e configurações;
- autenticação/onboarding em modo de demonstração, pronta para Supabase;
- painel administrativo Bar Flow;
- cardápio público por slug com confirmação de maioridade;
- migration inicial do Supabase com multi-tenant, itens, menus, auditoria e RLS;
- Design System Bar Flow baseado nos fundamentos visuais RanTech, sem uso da marca RanTech.

## Executar

Use `npm install` e depois `npm run dev`.

Para o ambiente real, copie `.env.example` para `.env.local` e preencha as credenciais aprovadas. Sem credenciais, a interface permanece em modo demonstração.

## Documentação

O pacote oficial está em `outputs/bar-flow-documentacao`, começando por `README.md` e `00_MASTER_BRIEFING.md`.

## Validação

Use `npm run lint` e `npm test`.

O escopo funcional, os limites dos planos, as regras de negócio, a arquitetura, o banco, o plano de implementação e os critérios de aceite estão documentados no pacote oficial.

## V1 atualizada

- O painel administrativo consulta dados do Supabase quando há sessão e configuração válidas.
- A área comercial está desativada; preços e períodos de teste são placeholders.
- Google OAuth e Mercado Pago permanecem congelados.
- A chave pública recomendada é `VITE_SUPABASE_PUBLISHABLE_KEY`.
