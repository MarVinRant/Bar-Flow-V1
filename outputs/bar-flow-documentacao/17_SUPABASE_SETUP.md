# Setup Supabase

1. Criar projeto por ambiente.
2. Configurar Auth e provedores e-mail/Google.
3. Definir URLs de redirecionamento.
4. Criar migrations na ordem do schema.
5. Ativar extensões necessárias com parcimônia.
6. Criar buckets para imagens e políticas de Storage.
7. Ativar RLS e testar políticas com usuários de tenants diferentes.
8. Criar funções server-side para limites, assinatura e Mercado Pago.
9. Configurar webhooks com idempotência.
10. Registrar variáveis apenas em ambiente seguro.

Nunca usar `service_role` no frontend. Aplicar migrations e seeds via pipeline revisável. Validar exclusão, restauração, auditoria e contexto de estabelecimento antes de liberar produção.

