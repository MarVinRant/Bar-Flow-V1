# Manual do Usuário — Bar Flow

Versão: V1 — 05/08/2026  
Idioma: português brasileiro  
Produto: Bar Flow

## 1. O que é o Bar Flow

O Bar Flow organiza receitas, produtos, preparos e cardápios de negócios que trabalham com bebidas. Cada empresa possui seu próprio espaço de dados, separado de outros clientes.

Este manual descreve o uso da V1 e também diferencia o que está previsto para as versões seguintes. Recursos comerciais e Mercado Pago estão congelados na V1; Google OAuth foi autorizado e depende da configuração do provedor.

## 2. Acesso à conta

### Entrar

1. Abra a aplicação.
2. Informe seu e-mail e sua senha.
3. Selecione **Entrar**.

Na V1, os métodos executáveis são e-mail/senha e Google OAuth, desde que o provedor esteja configurado no ambiente.

### Recuperar senha

1. Na tela de acesso, selecione **Esqueci minha senha**.
2. Informe o e-mail cadastrado.
3. Abra o link recebido para redefinir a senha.

Se a mensagem não chegar, confira spam e lixo eletrônico.

## 3. Primeiro acesso e onboarding

No primeiro acesso, informe:

- nome do estabelecimento;
- cidade;
- telefone ou WhatsApp;
- segmento do negócio;
- itens iniciais desejados.

Ao concluir, o sistema prepara o contexto do estabelecimento e leva você ao ambiente principal.

## 4. Estrutura do Bar Flow

O produto segue esta organização:

`Usuário → Grupo empresarial → Estabelecimento → Meu Acervo`

Um usuário pode participar de mais de um grupo ou estabelecimento, conforme suas permissões. Os dados de um estabelecimento não ficam disponíveis para outro tenant.

## 5. Visão geral

O dashboard apresenta o resumo operacional do estabelecimento, incluindo:

- receitas e produtos cadastrados;
- itens publicados;
- atividade recente;
- atalhos para criar itens;
- acesso à Biblioteca Mestre;
- acesso ao cardápio.

Use a busca global para localizar receitas, produtos e preparos.

## 6. Biblioteca Mestre

A Biblioteca Mestre contém conteúdo curado pelo Bar Flow.

### Consultar itens

1. Abra **Biblioteca**.
2. Use as categorias de receitas, produtos e preparos.
3. Abra um item para consultar seus detalhes.

Os clientes não editam diretamente a Biblioteca Mestre. Um item mestre pode ser sugerido para curadoria, mas a publicação depende da equipe responsável.

### Copiar para o acervo

1. Encontre o item desejado.
2. Selecione **Adicionar** ou **Copiar para o acervo**.
3. Revise os dados.
4. Confirme a cópia.

A cópia se torna independente. Alterações posteriores no seu acervo não alteram o item mestre.

## 7. Meu Acervo

O Meu Acervo é a biblioteca privada do estabelecimento.

Ele pode conter:

- receitas;
- produtos;
- preparos auxiliares;
- favoritos;
- itens utilizados em cardápios.

### Criar uma receita

1. Abra **Meu Acervo**.
2. Selecione **Novo item** e depois **Receita**.
3. Informe nome, categoria, descrição e composição.
4. Relacione produtos e preparos quando aplicável.
5. Salve.

### Criar um produto

Informe nome, categoria e, quando necessário, SKU e código de barras. O preço público é opcional.

### Preparos auxiliares

Use preparos para itens como xaropes, bases e componentes utilizados em outras receitas.

### Favoritos

Use o ícone de favorito na Biblioteca ou no acervo para encontrar itens importantes rapidamente.

### Exclusão e lixeira

A exclusão é lógica quando aplicável. O item permanece na lixeira por 30 dias, período em que pode ser restaurado. A exclusão definitiva só deve ocorrer após esse prazo, conforme as regras de retenção.

## 8. Cardápio ou catálogo

O Bar Flow permite montar um cardápio ou catálogo público sem carrinho e sem checkout.

### Criar e organizar

1. Abra **Meu Cardápio**.
2. Crie um cardápio ou catálogo.
3. Adicione itens do Meu Acervo.
4. Organize a ordem e as categorias.
5. Defina se o preço público será exibido.
6. Escolha como itens indisponíveis serão tratados: ocultos ou identificados como indisponíveis.

### Publicar

1. Revise o nome e a aparência.
2. Confirme o slug público.
3. Selecione **Publicar**.

Após publicado, o cardápio pode ser consultado sem login.

### Compartilhar

Você pode:

- copiar o link público;
- gerar ou exibir o QR Code;
- compartilhar pelo WhatsApp.

A tela pública não possui carrinho nem checkout na V1. O botão de interesse pode direcionar o cliente para o WhatsApp do estabelecimento.

### Bebidas alcoólicas e tabaco

Quando houver conteúdo restrito, a tela pública deve solicitar confirmação de maioridade e exibir aviso de consumo responsável.

## 9. Usuários e permissões

Os papéis previstos são:

- **Proprietário:** controle completo do grupo e do estabelecimento.
- **Administrador/Gerente:** gestão operacional conforme a permissão recebida.
- **Operador:** uso das funções operacionais permitidas.
- **Somente leitura:** consulta sem alteração.
- **Administrador Bar Flow:** acesso exclusivo ao painel interno da equipe Bar Flow.

Nunca compartilhe senhas. Remova ou desative acessos de pessoas que não trabalham mais no estabelecimento.

## 10. Painel administrativo Bar Flow

O painel administrativo é interno e não deve ser usado por clientes comuns.

Quando conectado ao Supabase e acessado por uma sessão com papel `barflow_admin`, ele pode consultar:

- grupos empresariais;
- estabelecimentos ativos;
- usuários/memberships;
- itens publicados na Biblioteca Mestre;
- auditoria recente.

Métricas comerciais, pagamentos e receita recorrente não devem ser exibidos como dados reais enquanto Mercado Pago e cobrança estiverem congelados.

## 11. Segurança e privacidade para o usuário

- Use senha exclusiva.
- Encerre sessões em dispositivos compartilhados.
- Não envie dados sensíveis em comentários ou nomes de itens.
- Confirme a maioridade quando solicitado.
- Revise os termos legais antes da publicação comercial definitiva.

## 12. O que está disponível por versão

### V1 — núcleo publicável

Escopo aprovado para a V1:

- cadastro, login por e-mail e senha e recuperação de senha;
- onboarding e contexto de grupo/estabelecimento;
- dashboard;
- Biblioteca Mestre somente leitura;
- cópia de itens para o Meu Acervo;
- receitas, produtos e preparos;
- favoritos, pesquisa e lixeira;
- cardápio/catálogo público;
- publicação, slug, link, QR Code e WhatsApp;
- confirmação de maioridade e consumo responsável quando aplicável;
- usuários, papéis, grupos e estabelecimentos;
- auditoria;
- Supabase, PostgreSQL, Storage e RLS;
- painel administrativo com dados reais, quando configurado;
- responsividade, estados vazios, mensagens de erro e validações básicas.

Congelados na V1:

- Mercado Pago;
- assinaturas, cobrança e teste gratuito;
- inadimplência, cancelamento e reativação;
- preços comerciais ativos.

### V2 — evolução operacional

Previsto para planejamento posterior, sem implementação na V1:

- Mercado Pago e assinaturas;
- planos, trial, limites, downgrade e cobrança;
- importação CSV/JSON com revisão;
- ações em lote;
- galeria de imagens;
- histórico de versões;
- melhorias de equipe e permissões;
- relatórios operacionais iniciais.

### V3 — expansão da plataforma

Previsto para uma etapa posterior:

- white label ampliado e maior personalização;
- multiunidade operacional completo;
- estoque;
- financeiro;
- eventos avançados;
- IA funcional;
- relatórios avançados;
- domínio próprio;
- recursos avançados de biblioteca técnica, vídeos e certificações;
- carrinho, pedidos e checkout, caso sejam aprovados em novo escopo.

As listas de V2 e V3 não autorizam implementação automática. Cada item precisa de aprovação, critérios de aceite e atualização documental.

## 13. Ajuda e solução de problemas

Se uma tela estiver vazia, primeiro confira o estabelecimento ativo, sua permissão e a conexão com o ambiente. Se o problema persistir, registre a tela, horário, usuário e ação realizada sem incluir senha ou token.
