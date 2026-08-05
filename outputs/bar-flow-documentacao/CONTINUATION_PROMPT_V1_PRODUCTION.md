# CONTINUAÇÃO OFICIAL — BAR FLOW V1 PUBLICÁVEL

Continue o desenvolvimento do SaaS multi-tenant Bar Flow neste workspace, usando o código existente e a pasta documental `bar-flow-documentacao` como fonte de contexto. Leia primeiro `README.md`, `00_MASTER_BRIEFING.md`, `01_PRODUCT_SCOPE.md`, `02_PRODUCT_RULES.md`, `20_STATUS.md`, `14_IMPLEMENTATION_PLAN.md` e `19_CODEX_EXECUTION_GUIDE.md`. Depois analise o repositório antes de alterar qualquer arquivo.

## Objetivo

Concluir e deixar pronta a V1 publicável do Bar Flow, preservando as decisões aprovadas, corrigindo o que estiver incompleto e entregando uma aplicação consistente, testada, documentada e preparada para a Vercel.

Não redesenhe o produto, não invente funcionalidades e não descongele escopos. Preserve o que já estiver correto. Se encontrar contradição entre documentos históricos e este prompt, este prompt e o `20_STATUS.md` representam a decisão mais recente para a execução da V1.

## Stack e infraestrutura

- React + TypeScript + Vite.
- Supabase/PostgreSQL, Storage e RLS.
- GitHub: https://github.com/MarVinRant/Bar-Flow-V1
- Vercel: https://bar-flow-jade.vercel.app/
- Mercado inicial: Brasil; interface em português; moeda em reais.
- Supabase de produção já criado: https://pyibqvqwpgqstcdwviva.supabase.co
- Usar as variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`.
- Nunca gravar chaves, secrets ou credenciais na documentação pública, no código ou em commits.

## Decisões de autenticação e comercial

- A autenticação executável na V1 é somente por e-mail e senha.
- Google OAuth está congelado e não deve ser implementado nesta etapa.
- Mercado Pago está congelado.
- Não implementar nem ativar assinaturas, cobranças, teste gratuito, inadimplência, cancelamento ou reativação.
- Preços atuais na interface são placeholders e não podem ser tratados como preços comerciais ativos.
- Referência estimada para futura aprovação: Bronze R$ 59,90/mês, Silver R$ 129,90/mês e Gold R$ 249,90/mês; anual com 15% de desconto.
- Manter a cobrança desativada até aprovação comercial final.

## Arquitetura obrigatória

Preserve o modelo multi-tenant: usuário → grupo empresarial → estabelecimento → Meu Acervo. O Meu Acervo contém receitas, produtos, preparos auxiliares, cardápios/catálogos e favoritos. A Biblioteca Mestre permanece separada e somente leitura para clientes.

Itens copiados da Biblioteca Mestre tornam-se independentes. Nenhum tenant pode ler ou alterar dados de outro tenant. Valide permissões no frontend e no backend, com RLS como controle de segurança efetivo.

## Escopo executável da V1

Finalizar somente:

- frontend, navegação e onboarding;
- autenticação por e-mail e senha, sessão, recuperação e proteção de rotas;
- dashboard com dados reais;
- Biblioteca Mestre e Meu Acervo;
- receitas, produtos, preparos auxiliares e favoritos;
- cardápio/catálogo público, publicação, slug, QR Code e compartilhamento por WhatsApp;
- painel administrativo Bar Flow com dados reais;
- grupos, estabelecimentos, usuários, permissões e registros de auditoria previstos;
- Supabase, migrations, tabelas, relacionamentos, índices, RLS, seeds e integração por ambiente;
- loading, empty states, erros, validações, responsividade, acessibilidade e testes;
- documentação, manuais de usuário e técnico, configuração e deploy.

### Biblioteca real — opção A

Preparar a biblioteca real com templates CSV/JSON, importador e etapa de revisão antes da publicação. Não publicar conteúdo sem revisão e não inventar receitas, produtos, licenças ou dados comerciais.

### Identidade e documentos legais

Manter o Design System aprovado, baseado nas escolhas visuais RanTech, mas sem usar o logo RanTech no produto. Usar apenas o logo funcional provisório Bar Flow/BF. Termos de Uso, Privacidade e Cookies podem ser estruturados como rascunhos, claramente marcados para revisão jurídica antes da publicação definitiva.

## Fora da V1 e congelado

Não implementar nem reabrir: Google OAuth; Mercado Pago e todo o fluxo de assinaturas/cobrança; white label completo; multiunidade operacional; IA; estoque; financeiro; eventos; relatórios avançados; ou qualquer funcionalidade V2/V3 não listada no escopo executável.

## Forma de trabalho obrigatória

1. Inspecione estrutura, scripts, dependências, rotas, componentes, migrations, seeds, variáveis e testes antes de editar.
2. Compare a implementação com a documentação e corrija apenas o necessário para a V1 aprovada.
3. Preserve mudanças existentes e não crie framework paralelo.
4. Faça banco, tipos, RLS, frontend e testes evoluírem de forma consistente.
5. Use fallback local somente quando necessário para desenvolvimento; a operação principal deve usar dados reais do Supabase.
6. Não simule integrações congeladas como se estivessem ativas.
7. Execute lint, typecheck, testes, build, smoke test, verificação de responsividade, acessibilidade, console e RLS.
8. Atualize README e `20_STATUS.md` com concluído, pendências, bloqueios, validações e escopos congelados.
9. Produza ou atualize manual do usuário, manual técnico e relatório final de validação.

## Critério de conclusão

Considere a V1 concluída somente quando o usuário puder criar conta por e-mail e senha, configurar seu contexto, consultar/copiar itens, criar e editar receitas e produtos, montar e publicar um cardápio/catálogo, compartilhar por link/QR Code/WhatsApp e operar com isolamento seguro entre tenants, enquanto o painel administrativo funciona com dados reais e a aplicação passa pelas validações disponíveis.

Ao final, entregue um resumo objetivo com arquivos alterados, validações executadas, pendências reais e tudo que permanece congelado.
