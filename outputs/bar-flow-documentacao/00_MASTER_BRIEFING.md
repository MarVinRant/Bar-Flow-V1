# Bar Flow — Master Briefing

## Identidade

Bar Flow é um SaaS vertical brasileiro para organizar a operação de bebidas de bares, casas de show, casas noturnas, adegas, tabacarias, restaurantes com operação de bebidas, bartenders autônomos e eventos.

**Proposta:** a plataforma que organiza receitas, produtos, cardápios e operação de bebidas do negócio em um único ambiente.

## Decisões congeladas

- Interface em português; moeda e contexto inicial brasileiros.
- React + TypeScript + Vite.
- Supabase como autenticação, banco, Storage e RLS.
- Mercado Pago como gateway inicial; cartão e Pix.
- Vercel para deploy e GitHub como origem do código.
- Login por e-mail/senha e Google.
- E-mail pode ser confirmado em até 24 horas; recuperação por e-mail.
- Multi-tenant por grupo empresarial e estabelecimento.
- Biblioteca Mestre separada da biblioteca privada do cliente.
- Cópias de itens mestres são independentes.
- Link público `barflow.app/nome-do-estabelecimento`, QR Code e compartilhamento por WhatsApp.
- V1 sem carrinho, sem pedidos completos, sem IA funcional, sem domínio próprio e sem remoção total da marca Bar Flow.
- Conteúdo de bebidas alcoólicas e tabaco exige confirmação de maioridade e consumo responsável.

## Escopo V1

Cadastro, login, Google Login, recuperação de senha, onboarding, dashboard operacional inteligente, Biblioteca Mestre, Meu Acervo, receitas, produtos, preparos auxiliares, favoritos, cardápio/catalogo público, publicação, QR Code, WhatsApp, configurações, assinaturas, cobrança e painel administrativo Bar Flow.

## Planos

Teste de 7 dias com acesso Silver. Após o teste, 3 dias somente leitura. Bronze, Silver e Gold possuem limites e permissões definidos no documento 03. Bronze é a prioridade de implementação, mas a arquitetura nasce preparada para os três planos.

## Princípios de construção

1. Escopo congelado.
2. Regras de negócio no backend e frontend.
3. Dados de tenants sempre protegidos por RLS.
4. Conteúdo, regras, interface, persistência e analytics separados.
5. Mobile first, acessível, responsivo e sem dependência de hover.
6. Nenhuma marca ou logo RanTech dentro do produto.
7. Não inventar dados, métricas, preços ou funcionalidades.
8. Toda ação destrutiva deve ser reversível por 30 dias quando aplicável.

## Sucesso da V1

Usuário consegue criar conta, configurar o estabelecimento, encontrar/copiar itens, criar e editar receitas/produtos, montar e publicar um cardápio/catálogo, compartilhar por link/QR/WhatsApp, gerenciar assinatura e operar com isolamento seguro entre estabelecimentos.

