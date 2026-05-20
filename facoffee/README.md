# FACOFFEE - Ambiente de Desenvolvimento Local

Este repositório fornece a infraestrutura base para a disciplina de Engenharia de Software, apoiando o desenvolvimento dos serviços propostos para a solução FACOFFEE.

![Arquitetura FACOFFEE](./arquitetura-facoffee.svg)

## 1) Objetivo para estudantes

Neste projeto, vocês irão implementar serviços da solução FACOFFEE seguindo:

- os limites e as responsabilidades definidos na arquitetura;
- os endpoints, contratos e regras de negócio descritos no OpenAPI;
- a comunicação assíncrona orientada a eventos, quando aplicável.

O arquivo [`docker-compose.yml`](./docker-compose.yml) não sobe os serviços de domínio (Users, Participation, Finance etc.).
Ele sobe apenas as dependências de plataforma para apoiar o desenvolvimento local:

- API Gateway (Nginx)
- RabbitMQ (mensageria)
- Keycloak (autenticação e autorização)
- Mailpit (captura de e-mails em ambiente de desenvolvimento)

## 2) Pré-requisitos

- Docker 24+ e Docker Compose v2+
- Git
- Navegador web
- (Opcional) `curl` para testes de API

Verifique:

```bash
docker --version
docker compose version
```

## 3) Preparação inicial

No Linux/macOS, clone e entre no projeto:

```bash
git clone <url-do-repositorio>
cd facoffee
```

## 4) Subindo o ambiente

Inicie os serviços:

```bash
docker compose up -d
```

Confira o status:

```bash
docker compose ps
```

Para parar:

```bash
docker compose down
```

Para parar removendo volumes (reinício limpo, incluindo Keycloak):

```bash
docker compose down -v
```

## 5) Interfaces disponíveis

### API Gateway (Nginx)

- URL base: <a href="http://localhost:8000" target="_blank" rel="noopener noreferrer">http://localhost:8000</a>
- Healthcheck: <a href="http://localhost:8000/health" target="_blank" rel="noopener noreferrer">http://localhost:8000/health</a>
- Uso principal: entrada única HTTP para os serviços de domínio

Rotas de proxy por domínio:

- `/api/users/*` -> `host.docker.internal:3001`
- `/api/participation/*` -> `host.docker.internal:3002`
- `/api/finance/*` -> `host.docker.internal:3003`

Regras de autenticação no gateway:

- `POST /api/users` é público (sem token), conforme contrato.
- Demais rotas `/api/*` exigem `Authorization: Bearer <token>` válido.
- Validação do token é feita no Keycloak (`/userinfo`) pelo gateway.

### RabbitMQ

- URL do painel: <a href="http://localhost:15672" target="_blank" rel="noopener noreferrer">http://localhost:15672</a>
- Porta AMQP: `localhost:5672`
- Uso principal: publicar e consumir eventos entre serviços

Observação: as configurações iniciais são carregadas por:

- [`rabbitmq/rabbitmq.conf`](./rabbitmq/rabbitmq.conf)
- [`rabbitmq/definitions.json`](./rabbitmq/definitions.json)

### Keycloak

- Admin Console: <a href="http://localhost:8080" target="_blank" rel="noopener noreferrer">http://localhost:8080</a>
- Usuário admin: `facoffee`
- Senha admin: `facoffee`
- Realm pré-configurado: `facoffee`
- Usuário inicial do realm: `facoffee@facom.ufms.br` (role `MANAGER`)

Separação importante de realms (para evitar confusão):

- Realm `master`: realm interno e obrigatório do Keycloak, usado para administração da plataforma.
- Realm `facoffee`: realm da aplicação, que deve ser usado pelos serviços e estudantes para testes de autenticação/autorização.
- O realm `master` não pode ser removido, e `facoffee` não pode substituí-lo como realm de sistema.

Clients criados automaticamente no realm `facoffee`:

- `facoffee-public` (cliente público)
- `facoffee-private` (cliente confidencial)
  - Secret fixo: `facoffee-private-secret`
- `domain-roles` (client scope para expor roles de domínio na claim `roles`)

Arquivo de import do realm:

- [`keycloak/realm-facoffee.json`](./keycloak/realm-facoffee.json)

### Mailpit

- UI web (caixa de entrada dev): <a href="http://localhost:8025" target="_blank" rel="noopener noreferrer">http://localhost:8025</a>
- SMTP local: `localhost:1025`

No ambiente atual, o Keycloak usa o Mailpit por padrão para envio de e-mails no realm `facoffee`.
Isso significa que as mensagens ficam visíveis na UI do Mailpit e não são entregues para Gmail ou outros provedores externos.

## 6) Fluxo recomendado de uso em aula/projeto

1. Suba a infraestrutura com `docker compose up -d`.
2. Suba os serviços de domínio nas portas `3001..x` (ex.: Users `3001`, Participation `3002`, Finance `3003`).
3. Acesse o Keycloak e confira o realm e os clients.
   - Para o projeto, sempre trabalhe no realm `facoffee`.
4. Acesse o RabbitMQ e valide exchanges/filas conforme o desenho arquitetural.
5. Implemente seu serviço de domínio (Users/Participation/Finance etc.).
6. Aponte seu serviço para:
    - Keycloak (JWT/OIDC)
    - RabbitMQ (eventos)
    - API definida em [`api-docs.yaml`](./api-docs.yaml)
7. Chame a API sempre por `http://localhost:8000/api`.
8. Use o Mailpit para inspecionar e-mails gerados em cenários de notificação/autenticação.

## 7) Como usar o contrato da API (`api-docs.yaml`)

O arquivo [`api-docs.yaml`](./api-docs.yaml) define:

- endpoints HTTP dos domínios;
- regras de segurança por operação (`bearerAuth`, roles e regras de acesso);
- formatos de request/response;
- eventos de domínio documentados na extensão `x-domain-events`.

Para visualizar e explorar os endpoints de forma interativa, recomenda-se usar o Swagger:

- Swagger Editor: <a href="https://editor.swagger.io/" target="_blank" rel="noopener noreferrer">https://editor.swagger.io/</a>
- Swagger UI Demo: <a href="https://petstore.swagger.io/" target="_blank" rel="noopener noreferrer">https://petstore.swagger.io/</a>

Passo rápido:

1. Abra o Swagger Editor.
2. Cole o conteúdo de [`api-docs.yaml`](./api-docs.yaml).
3. Navegue pelos endpoints, schemas e exemplos.

Sugestão de trabalho:

- Escolha um bounded context (ex.: Users).
- Implemente os endpoints obrigatórios no seu serviço.
- Garanta conformidade de payloads e códigos HTTP com o OpenAPI.
- Integre a autorização com tokens emitidos pelo Keycloak.

## 8) Teste rápido de autenticação

Exemplo para obter token do client privado:

```bash
curl -X POST "http://localhost:8080/realms/facoffee/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials" \
  -d "client_id=facoffee-private" \
  -d "client_secret=facoffee-private-secret"
```

Exemplo para obter token com o client público (usuário do realm):

```bash
curl -X POST "http://localhost:8080/realms/facoffee/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=password" \
  -d "client_id=facoffee-public" \
  -d "username=facoffee@facom.ufms.br" \
  -d "password=facoffee"
```

Com o token em mãos, use no cabeçalho:

```text
Authorization: Bearer <access_token>
```

As roles de domínio são emitidas diretamente na claim `roles` do token (ex.: `MANAGER`, `PARTICIPANT`).
Além disso, a role `MANAGER` possui permissões de gestão de usuários no realm (`realm-management`: `query-users`, `view-users`, `manage-users`).

## 9) Solução de problemas comuns

- Porta em uso:
  - Verifique se `8000`, `5672`, `15672`, `8080`, `1025` ou `8025` já estão ocupadas.
- Realm não apareceu no Keycloak:
  - Rode `docker compose down -v` e suba novamente.
- E-mail não chega em caixa externa:
  - Comportamento esperado no dev; verifique no Mailpit.

## 10) Referências importantes

- Arquitetura: [`arquitetura-facoffee.svg`](./arquitetura-facoffee.svg)
- Contrato API: [`api-docs.yaml`](./api-docs.yaml)
- Contrato assíncrono: [`async-docs.yaml`](./async-docs.yaml)
- Guia da equipe Users: [`GUIA_EQUIPE_USERS.md`](./GUIA_EQUIPE_USERS.md)
- Guia da equipe Participation: [`GUIA_EQUIPE_PARTICIPATION.md`](./GUIA_EQUIPE_PARTICIPATION.md)
- Guia da equipe Finance: [`GUIA_EQUIPE_FINANCE.md`](./GUIA_EQUIPE_FINANCE.md)
- Compose local: [`docker-compose.yml`](./docker-compose.yml)
- Realm Keycloak: [`keycloak/realm-facoffee.json`](./keycloak/realm-facoffee.json)
