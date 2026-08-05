# Estratégia de seed

## Princípios

Seeds determinísticos, idempotentes, versionados e separados por ambiente. Nunca inserir segredos, dados pessoais reais ou imagens sem licença.

## Conteúdo

Seed inicial com categorias, aproximadamente 100 receitas e 300 produtos mestre, placeholders e dados de demonstração claramente marcados.

## Ordem

1. enums/configuração;
2. categorias;
3. receitas mestre e ingredientes;
4. produtos mestre;
5. planos/entitlements;
6. conta administrativa de desenvolvimento;
7. fixtures de tenant somente em ambiente local/staging.

## Produção

Seed de produção deve ser revisado, executado com migração versionada e acompanhado de contagem/checksum. Não usar fixtures de teste em produção.

