# Critérios de aceite V1

## Funcional

- Cadastro, login, Google e recuperação funcionam.
- Onboarding salva estabelecimento e segmento.
- Dashboard mostra atalhos, recentes, notificações e estados vazios.
- Mestre permite buscar/copiar com revisão.
- Acervo permite criar, editar, duplicar e excluir receitas/produtos.
- Preparos auxiliares podem compor receitas.
- Cardápio/catálogo publica por link e QR Code.
- Página pública funciona em desktop/mobile e WhatsApp abre mensagem.
- Favoritos, lixeira, exportação CSV/JSON e configurações funcionam.
- Trial, read-only, tolerância, cancelamento, reativação e downgrade respeitam regras.
- Admin é inacessível a cliente comum.

## Qualidade

- Sem erros TypeScript ou críticos no console.
- Lighthouse ≥90 em Performance, Acessibilidade e Boas Práticas nas telas principais.
- Contraste AA, teclado, foco visível e reduced motion.
- Testado em desktop e mobile.
- RLS impede leitura cruzada entre tenants.
- Segredos não aparecem no bundle.

