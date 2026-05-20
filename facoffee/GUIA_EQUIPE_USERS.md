# Guia da Equipe Users

Este documento define o escopo, as entregas e os critérios de qualidade da equipe responsável pelo serviço de usuários.

## 1) Missão da equipe

- Implementar o domínio de usuários da aplicação.
- Integrar cadastro e gestão de conta com o Keycloak.
- Garantir autorização por papéis de domínio (`MANAGER`, `PARTICIPANT`).

## 2) Escopo funcional

- Criar usuário no domínio e no Keycloak.
- Listar usuários com filtros e paginação.
- Buscar usuário por identificador.
- Atualizar dados básicos do usuário.
- Desativar usuário logicamente.
- Substituir papéis (`roles`) do usuário.

## 3) Endpoints sob responsabilidade

- `POST /users`
- `GET /users`
- `GET /users/{userId}`
- `PATCH /users/{userId}`
- `DELETE /users/{userId}`
- `PUT /users/{userId}/roles`

Referência obrigatória: `api-docs.yaml`.

## 4) Regras de negócio mínimas

- E-mail deve ser único no domínio.
- Usuário recém-criado inicia como `ACTIVE`.
- Papel padrão deve ser `PARTICIPANT` quando nenhum papel for informado.
- Apenas gestores podem listar todos os usuários.
- Participante só pode consultar/alterar/desativar o próprio usuário quando a regra assim permitir.
- Alteração de papéis deve substituir integralmente os papéis atuais.

## 5) Segurança e Keycloak

- Validar JWT recebido nos endpoints protegidos.
- Ler papéis na claim `roles` (fallback opcional para `realm_access.roles`).
- No cadastro, criar/atualizar usuário no realm `facoffee`.
- Quando houver alteração de papéis no domínio, refletir no Keycloak.

## 6) Eventos de domínio

- Publicar eventos de criação, atualização de papéis e desativação, quando previstos em `async-docs.yaml`.
- Garantir idempotência em operações de integração com mensageria.

## 7) Persistência e modelo

- Cada registro de usuário deve conter ao menos: `id`, `name`, `email`, `status`, `roles`, `createdAt`.
- Manter `updatedAt` e `deactivatedAt` quando aplicável.
- Não compartilhar banco com outros serviços.

## 8) Testes obrigatórios

- Testes unitários das regras de negócio.
- Testes de integração dos endpoints principais.
- Testes de autorização:
  - `MANAGER` com acesso permitido;
  - `PARTICIPANT` fora da regra com acesso negado.
- Testes de conflito de e-mail no cadastro.

## 9) Critérios de aceite

- Todos os endpoints do escopo funcionando conforme contrato.
- Erros e códigos HTTP aderentes ao `api-docs.yaml`.
- Fluxo com Keycloak funcional para criação e gestão de papéis.
- Cobertura mínima de testes definida pela equipe/docente.

## 10) Entregáveis

- Código-fonte do serviço Users.
- Coleção de testes automatizados.
- README do serviço com setup local e variáveis de ambiente.
- Evidências de testes (logs, relatório ou execução reproduzível).
