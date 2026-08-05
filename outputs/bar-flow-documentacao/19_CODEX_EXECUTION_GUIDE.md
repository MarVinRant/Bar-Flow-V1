# Guia de execução para o Codex

## Antes de alterar

Leia README e 00–20 na ordem indicada. Inspecione o repositório, preserve mudanças existentes, confirme stack e não crie framework paralelo.

## Durante

- Implementar uma fase por vez.
- Manter componentes pequenos e regras testáveis.
- Atualizar tipos, migrations, RLS e critérios juntos.
- Não inventar preço, conteúdo, métricas ou funcionalidades.
- Usar placeholders quando asset/licença não estiver disponível.
- Validar tenant no backend e frontend.
- Registrar pendências em 20_STATUS.md.

## Ao concluir cada fase

Executar lint, typecheck, testes, build e smoke test. Verificar mobile, teclado, contraste, console, RLS e ausência de segredos. Atualizar changelog se existir.

## Bloqueios

Se faltar credencial, asset, preço ou decisão comercial, deixar integração atrás de configuração e registrar como bloqueio; não simular produção silenciosamente.

