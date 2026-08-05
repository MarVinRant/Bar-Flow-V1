# Segurança, privacidade e RLS

## Autenticação

E-mail/senha e Google. Recuperação por e-mail. Sessões múltiplas permitidas. Estrutura preparada para 2FA futura, fora da V1. Confirmação de e-mail em até 24 horas.

## RLS

Ativar RLS em todas as tabelas. A política deve derivar o tenant a partir de `memberships`/contexto autorizado, nunca de um `tenant_id` enviado cegamente pelo navegador. Biblioteca Mestre tem leitura pública controlada; escrita somente para admins Bar Flow.

## Auditoria

Registrar login, criação, edição, exclusão, restauração, mudança de plano, publicação, convite e remoção de usuário. Não registrar senhas, tokens ou dados desnecessários.

## Proteções

Validação cliente/servidor, sanitização, rate limit, proteção contra força bruta, headers seguros, CSRF quando aplicável, Storage com políticas e URLs assinadas quando necessário.

## LGPD

Termos, privacidade e cookies acessíveis. Solicitação de exclusão com janela de 30 dias, cancelável pelo cliente, seguida de exclusão definitiva automática conforme política.

## Conteúdo restrito

Confirmar maioridade antes de acessar conteúdo alcoólico/tabaco e mostrar aviso de consumo responsável.

