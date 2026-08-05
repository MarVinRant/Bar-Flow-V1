# Status do projeto

## Varredura de publicaÃ§Ã£o â€” 05/08/2026

- RepositÃ³rio confirmado no Vercel: `MarVinRant/Bar-Flow-V1`, branch `main`.
- VariÃ¡veis `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` cadastradas nos ambientes Production e Preview.
- O deploy pÃºblico ainda estava apontando para a versÃ£o antiga (`aa8c3e4`); Ã© necessÃ¡rio um novo commit/deploy para publicar o cÃ³digo V1 (`aa8840e`).
- A URL pÃºblica ainda entregava o HTML antigo durante a varredura; nenhum segredo foi exposto.
- Supabase confirmado com 8 tabelas pÃºblicas, RLS habilitado em todas, 3 migrations aplicadas e advisors de seguranÃ§a sem alertas.
- Advisors de performance retornam apenas recomendaÃ§Ãµes informativas de Ã­ndices/polÃ­ticas, sem bloqueio de publicaÃ§Ã£o.

## Estado

Planejamento funcional, comercial, UX, arquitetura conceitual, segurança, painel administrativo e critérios de entrega: aprovados/congelados na conversa de referência.

Implementação da V1: em continuação para finalização publicável no repositório Bar Flow.

## Atualização de continuidade da V1 — 05/08/2026

As decisões abaixo são as instruções operacionais mais recentes para a finalização da V1 e prevalecem sobre trechos históricos dos documentos-base que mencionem Google OAuth ou cobrança como itens a implementar agora:

- Supabase de produção já criado: `https://pyibqvqwpgqstcdwviva.supabase.co`.
- O frontend deve usar `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`; nenhuma chave deve ser gravada em documentação pública.
- Repositório: `https://github.com/MarVinRant/Bar-Flow-V1`.
- Deploy atual: `https://bar-flow-jade.vercel.app/`.
- Autenticação executável na V1: e-mail/senha e Google OAuth, após configuração do provedor no Supabase.
- Mercado Pago, assinaturas, cobranças, teste gratuito, inadimplência, cancelamento e reativação estão congelados; não ativar cobrança.
- Preços exibidos atualmente são placeholders. Referência estimada para aprovação futura: Bronze R$ 59,90/mês, Silver R$ 129,90/mês e Gold R$ 249,90/mês; plano anual com 15% de desconto. Esses valores não são comerciais ativos.
- Biblioteca real segue a opção A: templates CSV/JSON, importador e revisão antes da publicação.
- Identidade visual: manter o Design System aprovado; usar somente logo funcional provisório Bar Flow/BF, sem logo RanTech.
- Termos de Uso, Privacidade e Cookies podem existir como rascunhos, sempre marcados para revisão jurídica.
- O prompt completo e autoritativo desta continuidade está em `CONTINUATION_PROMPT_V1_PRODUCTION.md`.

## Próximos passos

1. Ler e executar `CONTINUATION_PROMPT_V1_PRODUCTION.md`.
2. Inspecionar o código existente e conectar/validar o Supabase de produção por variáveis de ambiente.
3. Finalizar migrations, schema, relacionamentos, índices, RLS, seeds e auditoria.
4. Tornar o painel administrativo e as telas da V1 funcionais com dados reais.
5. Executar testes, acessibilidade, responsividade, build, smoke test e validação de deploy.
6. Atualizar README, manuais, documentação técnica, pendências e relatório final.

## Referências usadas

Os arquivos solicitados em `/mnt/data` não estavam montados neste ambiente. Foram usados como referência os materiais equivalentes disponíveis no workspace, especialmente briefing, arquitetura, Supabase e diretrizes de marca. Content Studio não foi incorporado ao escopo Bar Flow.

## Regra de atualização

Toda mudança deve indicar data, documento afetado, motivo, impacto e aprovação. Escopo congelado não deve ser expandido durante implementação sem decisão explícita.

## Validação técnica da continuidade — 05/08/2026

- Cliente Supabase ajustado para `VITE_SUPABASE_PUBLISHABLE_KEY`, com fallback compatível para a chave antiga.
- Painel administrativo V1 conectado a consultas reais de grupos, estabelecimentos, membros, Biblioteca Mestre e auditoria.
- Migration `0002_v1_rls_admin.sql` adicionada para políticas de leitura administrativa e isolamento por tenant.
- Migration `0003_v1_private_rls_helpers.sql` aplicada para remover funções `SECURITY DEFINER` da exposição pública.
- Migrations `0001`, `0002` e `0003` aplicadas no projeto Supabase de produção `pyibqvqwpgqstcdwviva`.
- Advisors de segurança do Supabase: sem alertas após a correção.
- Área comercial substituída por estado explícito de cobrança congelada; nenhum pagamento é ativado.
- `npm.cmd run lint`: aprovado, apenas avisos de componentes antigos não utilizados.
- `npm.cmd run build`: aprovado.
- `npm.cmd test`: aprovado, 2 testes.

Pendências reais: aplicar as migrations no projeto Supabase de produção, configurar as variáveis na Vercel, cadastrar/validar a membership `barflow_admin`, validar fluxos com usuário real e completar as telas de CRUD que ainda são protótipos visuais.

## Atualização Google OAuth — 05/08/2026

- Fluxo `signInWithOAuth({ provider: "google" })` reativado no cliente Supabase.
- O Client Secret deve permanecer configurado somente no Google/Supabase, nunca no frontend.
- Ainda é necessário validar provedor, URLs autorizadas, consentimento e login em produção.
