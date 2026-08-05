# Modelo de dados

Todas as tabelas de negócio possuem `id uuid`, timestamps, autoria quando aplicável e `deleted_at` quando sujeitas à lixeira.

## Núcleo multi-tenant

- `profiles`: vínculo com auth.users.
- `business_groups`: grupo empresarial.
- `establishments`: unidade, slug público e dados exibíveis.
- `memberships`: usuário, grupo/unidade, papel e status.
- `permission_overrides`: permissões Gold.

## Biblioteca e acervo

- `master_recipes`, `master_products`: conteúdo curado Bar Flow.
- `recipes`, `recipe_ingredients`: receitas privadas e composição.
- `products`: produtos privados.
- `preparations`: preparos auxiliares reutilizáveis.
- `master_suggestions`: sugestões de clientes.
- `favorites`, `recent_items`.

## Publicação

- `menus`: tipo `menu|catalog`, slug/configuração/status.
- `menu_items`: ordem, disponibilidade, preço público e referência ao item privado.
- `public_views` opcional para métricas não identificáveis.

## Plataforma

- `plans`, `subscriptions`, `payment_events`, `entitlements`.
- `notifications`, `audit_logs`, `support_requests`.

## Regras

FKs com integridade, índices por tenant e slug, enums controlados, cópia mestre independente, soft delete e constraints para limites quando possível. Segredos e tokens de pagamento ficam fora das tabelas públicas.

