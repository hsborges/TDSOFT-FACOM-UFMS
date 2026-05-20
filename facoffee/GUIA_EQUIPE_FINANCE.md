# Guia da Equipe Finance

Este documento orienta a equipe responsável pelo serviço financeiro da aplicação.

## 1) Missão da equipe

- Implementar gestão de pendências, despesas e comprovantes.
- Consolidar estado financeiro dos participantes.
- Integrar com eventos dos demais domínios.

## 2) Escopo funcional

- Criar e listar pendências financeiras.
- Consultar pendência por identificador.
- Registrar comprovantes de pagamento.
- Validar ou rejeitar comprovantes.
- Cadastrar e consultar despesas do domínio.

## 3) Endpoints sob responsabilidade

- Todos os endpoints do grupo `Finance` definidos em `api-docs.yaml`.

Referências obrigatórias:

- `api-docs.yaml`
- `async-docs.yaml`

## 4) Regras de negócio mínimas

- Pendência deve refletir corretamente competência, valor e status.
- Comprovante só pode ser validado/rejeitado por papel autorizado.
- Mudanças de status financeiro devem ser consistentes e auditáveis.
- Regras de prazo e reprocessamento (se previstas) devem ser respeitadas.

## 5) Segurança e autorização

- Validar JWT e papéis da claim `roles`.
- Aplicar regras de acesso conforme `x-authorization`.
- Operações de validação financeira restritas a `MANAGER` quando indicado no contrato.

## 6) Eventos e integração

- Consumir eventos de participação que impactem cobrança.
- Publicar eventos financeiros relevantes conforme `async-docs.yaml`.
- Tratar reentrega de mensagens com idempotência.
- Registrar falhas de processamento com estratégia de retry/erro técnico.

## 7) Persistência e modelo

- Entidades mínimas esperadas: `FinancialPending`, `PaymentProof`, `Expense` (ou equivalentes).
- Manter histórico de transições de status e data/hora de processamento.
- Banco de dados isolado de outros serviços.

## 8) Testes obrigatórios

- Testes unitários de cálculo e transição de status.
- Testes de integração dos endpoints de pendência e comprovante.
- Testes de autorização e acesso negado.
- Testes de consumo/publicação de eventos críticos.

## 9) Critérios de aceite

- Endpoints do domínio financeiro aderentes ao contrato.
- Fluxo de comprovantes completo (registro, validação, rejeição).
- Integração assíncrona confiável com os demais domínios.
- Cobertura de testes adequada ao risco das regras financeiras.

## 10) Entregáveis

- Código-fonte do serviço Finance.
- Testes automatizados (unitários e integração).
- README com instruções de execução local.
- Evidências de cenários financeiros ponta a ponta.
