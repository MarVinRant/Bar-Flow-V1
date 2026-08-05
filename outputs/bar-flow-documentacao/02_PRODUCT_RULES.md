# Regras permanentes do produto

1. Um usuário pode pertencer a vários grupos/estabelecimentos e alternar o contexto ativo.
2. Nenhum registro de um tenant pode ser lido ou alterado por outro tenant.
3. Biblioteca Mestre é somente leitura para clientes; clientes podem sugerir, não publicar.
4. Copiar cria registro independente e abre revisão antes de salvar.
5. Receitas e produtos são entidades diferentes; busca global pode unificá-los visualmente.
6. Exclusão é lógica; itens ficam 30 dias na lixeira e podem ser restaurados. Depois, exclusão automática, salvo retenção administrativa.
7. Excesso de limite é validado no frontend e backend.
8. Downgrade mostra excesso, exige seleção explícita e move excedentes para lixeira; não há apagamento silencioso.
9. Item indisponível pode ser ocultado ou exibido como indisponível, conforme escolha do cliente.
10. Cardápio/catálogo publicado pode ser consultado sem login.
11. Preço público é opcional.
12. Toda ação importante gera auditoria.
13. Dados sensíveis nunca ficam em logs de aplicação.
14. Falha de analytics nunca impede o uso principal.
15. Não adicionar nova funcionalidade sem atualizar escopo, critérios e status.

