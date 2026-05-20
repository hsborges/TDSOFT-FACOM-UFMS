# Guia da Equipe Participation

Este documento orienta a equipe responsável pelo serviço de cotas e adesões de participação.

## 1) Missão da equipe

- Implementar regras de criação e manutenção de cotas.
- Gerenciar adesões de usuários às cotas.
- Publicar eventos para integração com o domínio financeiro.

## 2) Escopo funcional

- Cadastrar cotas de participação.
- Listar cotas com filtros.
- Consultar cota por identificador.
- Atualizar dados de cota.
- Ativar/inativar cota conforme regras.
- Criar e encerrar adesões de usuários.

## 3) Endpoints sob responsabilidade

- Todos os endpoints do grupo `Participation` definidos em `api-docs.yaml`.

Referências obrigatórias:

- `api-docs.yaml`
- `async-docs.yaml`

## 4) Regras de negócio mínimas

- Cota deve ter `name`, `condition`, `items` e `amount` válidos.
- Valor de cota não pode ser negativo.
- Um usuário não pode possuir múltiplas adesões ativas simultâneas (quando a regra do contrato assim definir).
- Alterações de estado de cota/adesão devem ser auditáveis.
- Operações de gestão devem respeitar autorização por role.

## 5) Segurança e autorização

- Validar JWT e extrair papéis da claim `roles`.
- Aplicar restrições de acesso com base em `x-authorization` no contrato.
- Garantir que ações administrativas sejam restritas a `MANAGER`.

## 6) Eventos e integração

- Publicar eventos de criação/atualização de cotas e adesões conforme `async-docs.yaml`.
- Incluir metadados de rastreabilidade (ex.: `eventId`, `occurredAt`, `userId`).
- Garantir idempotência em publicações e consumos.

## 7) Persistência e modelo

- Entidades mínimas: `ParticipationQuota` e `ParticipationMembership` (ou nomenclatura equivalente).
- Registrar histórico de mudanças de status quando aplicável.
- Evitar acoplamento com banco de outros serviços.

## 8) Testes obrigatórios

- Testes unitários das regras de elegibilidade e estado.
- Testes de integração de endpoints críticos.
- Testes de autorização para operações de gestão.
- Testes de cenários de borda (adesão duplicada, cota inativa, valor inválido).

## 9) Critérios de aceite

- Endpoints de Participation conformes ao contrato.
- Publicação de eventos funcionando e verificável.
- Regras de negócio e autorização validadas por testes.
- Documentação do serviço clara e executável localmente.

## 10) Entregáveis

- Código-fonte do serviço Participation.
- Suíte de testes automatizados.
- README com setup e exemplos de chamadas.
- Evidências de integração via eventos.
