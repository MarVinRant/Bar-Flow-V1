# Manual Técnico para Finalização — Bar Flow

Versão: V1 — 05/08/2026  
Destinatário: sócio responsável pela finalização técnica e comercial

## 1. Objetivo deste manual

Este documento mostra o estado do projeto, como executar e publicar a V1 e o que falta para completar a estrutura originalmente planejada.

O escopo congelado deve ser respeitado. Não ativar Mercado Pago ou cobrança sem nova aprovação. O Google OAuth foi autorizado para esta etapa.

## 2. Estado atual

### Stack

- React;
- TypeScript;
- Vite/Vinext;
- Supabase/PostgreSQL;
- Supabase Auth;
- Supabase Storage e RLS;
- Vercel;
- GitHub.

Repositório: `https://github.com/MarVinRant/Bar-Flow-V1`  
Deploy informado: `https://bar-flow-jade.vercel.app/`  
Projeto Supabase informado: `https://pyibqvqwpgqstcdwviva.supabase.co`

### Já existente no workspace

- interface principal do produto;
- login por e-mail e senha;
- recuperação de senha;
- onboarding visual;
- dashboard visual;
- Biblioteca Mestre e Meu Acervo em evolução;
- cardápio público por slug;
- migration inicial do modelo multi-tenant;
- migration complementar de políticas administrativas;
- cliente Supabase;
- painel administrativo com consultas reais preparadas;
- documentação oficial do produto;
- testes de renderização;
- configuração de build e lint.

O código ainda possui telas que precisam substituir comportamentos visuais por CRUD persistente completo. Não considerar a V1 comercialmente finalizada antes dessa validação.

## 3. Estrutura principal de arquivos

- `app/page.tsx`: interface principal, autenticação, onboarding, produto e painel.
- `app/[slug]/page.tsx`: cardápio público.
- `app/globals.css`: design system e responsividade.
- `src/lib/supabase.ts`: cliente Supabase, autenticação e consultas administrativas.
- `supabase/migrations/0001_bar_flow_schema.sql`: schema inicial.
- `supabase/migrations/0002_v1_rls_admin.sql`: políticas complementares de tenant/admin.
- `tests/rendered-html.test.mjs`: testes de renderização e acessibilidade básica.
- `outputs/bar-flow-documentacao`: documentação oficial.

## 4. Configuração local

1. Instale Node.js compatível com o `package.json`.
2. Execute `npm install`.
3. Copie `.env.example` para `.env.local`.
4. Preencha apenas:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sua-chave-publicável
```

Nunca use `service_role` no frontend, nunca grave tokens no repositório e nunca coloque credenciais em documentação pública.

Executar localmente:

```bash
npm run dev
```

## 5. Banco de dados e Supabase

### Aplicação das migrations

Aplicar, na ordem:

1. `0001_bar_flow_schema.sql`;
2. `0002_v1_rls_admin.sql`.

Antes de aplicar em produção:

- conferir o projeto correto;
- validar backup e ambiente;
- confirmar que RLS está ativo em todas as tabelas expostas;
- revisar políticas com um usuário comum e com um administrador;
- confirmar que usuários de um estabelecimento não leem outro.

### Modelo central

O modelo é:

`auth.users → business_groups → establishments → private_items/menus`

As tabelas principais são:

- `business_groups`;
- `establishments`;
- `memberships`;
- `master_items`;
- `private_items`;
- `menus`;
- `menu_items`;
- `audit_logs`.

### Administrador interno

Para habilitar o painel real, um usuário interno precisa possuir membership ativa com:

```text
role = barflow_admin
status = active
```

O painel consulta dados usando a sessão autenticada. Não criar uma chave privilegiada no navegador para contornar RLS.

## 6. Finalização funcional da V1

Prioridade recomendada:

1. autenticação real e proteção de sessão;
2. onboarding persistente;
3. criação de grupo e estabelecimento;
4. leitura e cópia da Biblioteca Mestre;
5. CRUD de receitas, produtos e preparos;
6. favoritos e lixeira;
7. criação e edição de menus;
8. publicação pública por slug;
9. QR Code e compartilhamento;
10. auditoria das ações importantes;
11. painel administrativo real;
12. validação de RLS, responsividade, acessibilidade e deploy.

Toda regra de limite, permissão e isolamento deve existir no backend/RLS e não somente na interface.

## 7. Painel administrativo

O painel não deve mostrar números inventados. Na V1, deve mostrar apenas dados consultados com sucesso. Quando não houver sessão, configuração ou registros, mostrar estado vazio ou mensagem de configuração.

O painel pode evoluir para:

- grupos e estabelecimentos;
- usuários e memberships;
- Biblioteca Mestre;
- auditoria;
- suporte operacional;
- métricas comerciais somente depois da ativação formal da cobrança.

Não liberar o painel para clientes comuns.

## 8. Deploy na Vercel

1. Conecte o repositório GitHub ao projeto Vercel.
2. Configure o comando de build definido no `package.json`.
3. Cadastre no ambiente correto:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
```

4. Faça um deploy de preview.
5. Teste login, onboarding, acervo, publicação e cardápio público.
6. Promova para produção somente após os testes.

Não cadastrar `MERCADO_PAGO_*` ou `GOOGLE_*` como integrações ativas nesta etapa.

## 9. GitHub e fluxo de entrega

Recomendação:

1. trabalhar em branch de tarefa;
2. revisar alterações;
3. executar lint, build e testes;
4. abrir pull request;
5. validar preview da Vercel;
6. fazer merge somente após revisão.

Não versionar `.env.local`, secrets, tokens ou dumps com dados reais.

## 10. Validações obrigatórias

Executar:

```bash
npm run lint
npm run build
npm test
```

Também validar manualmente:

- cadastro e login;
- recuperação de senha;
- sessão expirada;
- onboarding;
- troca de estabelecimento;
- criação, edição e exclusão lógica;
- cópia da Biblioteca Mestre;
- publicação e despublicação;
- slug inexistente;
- QR Code e WhatsApp;
- confirmação de maioridade;
- navegação por teclado;
- mobile;
- ausência de erros no console;
- acesso cruzado entre tenants;
- acesso de usuário comum ao painel administrativo;
- acesso de `barflow_admin` ao painel.

## 11. Google OAuth

O frontend usa `supabase.auth.signInWithOAuth({ provider: "google" })`.

Para concluir a configuração:

1. Habilitar Google em Supabase Auth.
2. Informar Client ID e Client Secret no provedor do Supabase.
3. Adicionar a origem da aplicação em **Authorized JavaScript origins**.
4. Adicionar o callback do Supabase em **Authorized redirect URIs**.
5. Configurar a URL de produção e localhost na lista de redirecionamentos do Supabase.
6. Testar login, retorno, criação de usuário e sessão persistente.

O Client Secret nunca deve ser colocado em `VITE_*`, no GitHub, no frontend ou em documentação pública.

## 12. Escopos congelados

Não implementar nesta etapa:

- Mercado Pago;
- assinaturas;
- cobrança mensal ou anual;
- teste gratuito;
- inadimplência;
- cancelamento e reativação;
- preços comerciais ativos;
- white label completo;
- IA;
- estoque;
- financeiro;
- eventos avançados;
- relatórios avançados;
- outras funcionalidades V2/V3 não aprovadas.

## 12. O que falta para a estrutura originalmente planejada

### Mercado Pago e cobrança

Quando houver aprovação comercial:

1. confirmar preços e planos;
2. definir produtos e preços no Mercado Pago;
3. implementar checkout seguro no backend;
4. validar webhooks com assinatura;
5. persistir status de assinatura;
6. aplicar trial, tolerância e somente leitura;
7. implementar cancelamento, reativação e downgrade seguro;
8. testar pagamentos aprovados, recusados e pendentes;
9. revisar conciliação, logs e suporte.

Nenhum token do Mercado Pago deve chegar ao frontend.

### Expansões V2/V3

Devem ser tratadas como projetos separados, cada um com escopo, migração, critérios de aceite, riscos e aprovação próprios.

## 14. Critério de encerramento da V1

A V1 pode ser considerada pronta para publicação quando um usuário real conseguir criar sua conta, configurar o estabelecimento, consultar/copiar itens, manter seu acervo, montar e publicar um cardápio, compartilhar o link e operar sem acesso cruzado entre tenants; e quando o painel administrativo estiver acessível somente à equipe autorizada e consultando dados reais.

## 15. Regra final

Se faltar credencial, conteúdo, preço, decisão comercial ou configuração externa, registrar como pendência. Não simular sucesso e não ativar integração congelada apenas para esconder a pendência.
