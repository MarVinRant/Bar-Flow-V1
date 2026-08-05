# Assinaturas e cobrança

## Mercado Pago

Gateway inicial. Métodos: cartão e Pix. Ciclos: mensal e anual. Plano anual com 15% de desconto.

## Estados

trialing, active, past_due, read_only, canceled, expired e pending. O estado efetivo do acesso deve ser derivado de assinatura, período pago, tolerância e entitlements.

## Regras

- Trial de 7 dias com Silver.
- Após trial: 3 dias somente leitura.
- Falha de pagamento: 7 dias de tolerância.
- Cancelamento: acesso até fim do período pago.
- Reativação em até 30 dias: automática após pagamento.
- Downgrade com excesso: seleção explícita; excedentes na lixeira por 30 dias; sem exclusão silenciosa.

## Webhooks

Verificar assinatura, idempotência, evento bruto auditável sem segredos, atualização transacional e reconciliação. Nunca confiar somente no redirect do navegador.

## Preços

Não inventar valores neste pacote; manter planos/preços configuráveis e aguardar decisão comercial específica.

