# GeoPoint API — Projeto Final de Desenvolvimento Back-End

API REST completa para cadastrar, listar, consultar, alterar e excluir pontos geograficos. Implementacao em **Java 21 + Spring Boot 3.5.16 + PostgreSQL + JdbcTemplate**, separada em camadas (Controller, Service e Repository), usando DTOs, injeção de dependências, UUID, validacoes e tratamento de excecoes.

> **Importante:** este repositório contem o codigo-fonte preparado para executar. Para funcionar, voce deve iniciar um banco PostgreSQL (ou usar o Docker Compose). A API **nao esta publicada na nuvem** nem foi submetida ao AVA. Essas etapas dependem das suas contas/credenciais. O tema pode ser personalizado pelo grupo sem remover o CRUD obrigatorio.

## 1. Estrutura do projeto

```text
GeoPoint_API_Completa/
├── pom.xml
├── Dockerfile
├── docker-compose.yml
├── src/
│   ├── main/
│   │   ├── java/br/edu/atitus/geopoint/
│   │   │   ├── GeoPointApplication.java
│   │   │   ├── config/CorsConfig.java
│   │   │   ├── controller/PointController.java
│   │   │   ├── dto/PointRequest.java, PointResponse.java
│   │   │   ├── entity/Point.java
│   │   │   ├── exception/ApiError.java, GlobalExceptionHandler.java, ...
│   │   │   ├── repository/PointRepository.java
│   │   │   └── service/PointService.java
│   │   └── resources/application.yml, db/schema.sql
│   └── test/ (testes integrados com banco H2 isolado)
├── postman/GeoPoint.postman_collection.json
├── docs/GeoPoint_API_Documentacao.html
├── RELATORIO_MODELO.md
└── README.md
```

## 2. Opcao A — Executar com Docker (mais facil)

**Requisitos:** Docker Desktop instalado e aberto (Windows 10/11). Na pasta em que esta `docker-compose.yml`, execute no terminal:

```bash
docker compose up --build -d
```

O Compose sobe o **PostgreSQL** e a **API**. O schema/tabela `points` é criado automaticamente no PostgreSQL. Enderecos:

- API: <http://localhost:8080/api/points>
- Health: <http://localhost:8080/actuator/health>
- PostgreSQL local do host: `localhost:5433`; database=`geopoint`, usuario=`geopoint`, senha=`geopoint_dev_123` (padrao APENAS para testes locais).

Para acompanhar logs:

```bash
docker compose logs -f api
```

Para parar sem apagar registros:

```bash
docker compose down
```

> O volume do PostgreSQL preserva os dados. `docker compose down -v` **apaga o banco local**. Altere a senha padrao antes de expor serviços em rede.

## 3. Opcao B — Executar pelo IntelliJ IDEA

1. Instale o **Java JDK 21** e o **PostgreSQL** (ou crie apenas o banco com o Docker Compose).
2. Abra o IntelliJ > **Open** > selecione a pasta **GeoPoint_API_Completa** que contem o `pom.xml` > confie no projeto, se solicitado. Aguarde a importacao Maven.
3. No PostgreSQL, crie um banco chamado `geopoint`. O arquivo `src/main/resources/db/schema.sql` cria a tabela automaticamente ao iniciar a API.
4. Se o PostgreSQL estiver instalado diretamente no Windows na porta 5432, configure em **Run > Edit Configurations > Environment variables**:

   ```text
   DB_URL=jdbc:postgresql://localhost:5432/geopoint
   DB_USER=postgres
   DB_PASSWORD=SUA_SENHA
   ```

   Se estiver usando apenas o PostgreSQL do Docker Compose (porta **5433** no Windows), use `DB_URL=jdbc:postgresql://localhost:5433/geopoint`, `DB_USER=geopoint` e `DB_PASSWORD=geopoint_dev_123`.
5. Abra `src/main/java/br/edu/atitus/geopoint/GeoPointApplication.java` e clique no triangulo verde **Run** ao lado de `main()`.
6. Teste <http://localhost:8080/api/points> no navegador. Uma lista vazia `[]` indica que a API esta no ar e sem dados.

**Pelo terminal com Maven instalado:**

```bash
mvn clean test
mvn spring-boot:run
```

> Se usar o banco Docker **sem** subir a API Docker, execute `docker compose up -d postgres` e inicie o Java no IntelliJ com as variaveis acima.

## 4. Campos da API

| Campo | Tipo | Regras |
|---|---|---|
| `id` | UUID | Gerado automaticamente; nao enviar no JSON de cadastro ou alteracao |
| `name` | String | Obrigatorio, sem espacos isolados, ate 100 caracteres, nome unico ignorando maiusculas |
| `description` | String | Opcional, ate 255 caracteres |
| `latitude` | BigDecimal | Obrigatorio, de -90 a 90 |
| `longitude` | BigDecimal | Obrigatorio, de -180 a 180 |

Os campos String passam por `trim()`. A API aplica as mesmas validacoes no POST e no PUT. Consultas usam parâmetros preparados do JdbcTemplate (sem concatenacao de entrada do usuario em SQL).

## 5. Endpoints e respostas

| Metodo | URL | Operacao | HTTP sucesso |
|---|---|---|---|
| `POST` | `/api/points` | Cadastrar ponto | 201 Created |
| `GET` | `/api/points` | Listar pontos | 200 OK |
| `GET` | `/api/points/{id}` | Consultar por UUID | 200 OK |
| `PUT` | `/api/points/{id}` | Alterar por UUID | 200 OK |
| `DELETE` | `/api/points/{id}` | Excluir por UUID | 204 No Content |

Erros: **400** dados invalidos/nome duplicado/UUID malformado, **404** ponto nao encontrado e **500** erro interno inesperado. O campo `details` aponta os campos invalidos quando aplicavel.

### 5.1 POST — cadastro

```bash
curl --location 'http://localhost:8080/api/points' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "name": "Praça Central",
    "description": "Praça principal da cidade",
    "latitude": -28.2825,
    "longitude": -52.7869
  }'
```

A resposta 201 apresenta um JSON com `id` UUID. Guarde esse `id` para as outras operacoes.

### 5.2 GET — listar

```bash
curl --location 'http://localhost:8080/api/points'
```

### 5.3 GET — consultar

Substitua `SEU_UUID` pelo identificador retornado no cadastro.

```bash
curl --location 'http://localhost:8080/api/points/SEU_UUID'
```

### 5.4 PUT — alterar

```bash
curl --location --request PUT 'http://localhost:8080/api/points/SEU_UUID' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "name": "Praça Central Renovada",
    "description": "Nova descrição",
    "latitude": -28.2830,
    "longitude": -52.7875
  }'
```

### 5.5 DELETE — excluir

```bash
curl --location --request DELETE 'http://localhost:8080/api/points/SEU_UUID'
```

### 5.6 Exemplo de erro

```json
{
  "timestamp": "2026-11-23T20:00:00-03:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Dados invalidos ou ausentes",
  "path": "/api/points",
  "details": {"latitude": "A latitude deve ser menor ou igual a 90"}
}
```

## 6. Testar no Postman

1. Abra o Postman > **Import** > selecione `postman/GeoPoint.postman_collection.json`.
2. Execute **POST Cadastrar ponto**. O script do Postman salva automaticamente o `pointId` na colecao.
3. Execute GET Listar, GET Consultar, PUT Alterar, DELETE Excluir.
4. Verifique também respostas 400/404 e a rota `/actuator/health`.
5. Para testar a API publicada na nuvem, altere a variável `baseUrl` da colecao para a URL HTTPS de producao.

## 7. Publicar na nuvem (obrigatorio para o trabalho)

A pasta inclui `Dockerfile` para hospedar a aplicacao em Render, Koyeb ou servico semelhante. **Este projeto ainda nao esta efetivamente hospedado.**

1. Suba a pasta para um repositório GitHub.
2. Crie um **PostgreSQL** gerenciado na plataforma escolhida (ou num provedor compatível).
3. Crie um **Web Service** a partir do repositorio, utilizando o `Dockerfile`.
4. Configure as variaveis de ambiente de producao, sem usar senhas de desenvolvimento:

   ```text
   DB_URL=jdbc:postgresql://HOST:5432/NOME_DO_BANCO
   DB_USER=USUARIO_DO_BANCO
   DB_PASSWORD=SENHA_SEGURA
   CORS_ALLOWED_ORIGINS=https://seu-frontend.exemplo.com
   ```

   Algumas plataformas oferecem a URL no formato `postgresql://usuario:senha@host/banco`. Converta para `jdbc:postgresql://host:porta/banco` e separe usuario/senha em variaveis.
5. Inicie o servico e acesse `https://SUA_URL/actuator/health`. Depois, teste cada endpoint usando a URL publica.
6. Adicione no relatorio final o link do **GitHub** e o link **HTTPS da API**.

> Não inclua senha em GitHub e nao use `localhost` como link de API em producao. Esta API nao possui autenticacao: use-a apenas em contexto didatico ou adicione controle de acesso antes de expor dados reais.

## 8. Tarefa final do grupo

- Escolher e documentar um **tema personalizado** (ex.: pontos turisticos, praças, parques). O CRUD minimo deve permanecer como aqui.
- Preencher integrantes, RA, e-mails institucionais e a contribuição individual real de cada aluno.
- Criar e anexar a logo do aplicativo.
- Preencher o arquivo `RELATORIO_MODELO.md`, converter em PDF e enviar via AVA até **29/11/2026**.
- O link GitHub deve estar acessivel ao professor; se for privado, adicione `luciano-ferretto` como colaborador.

## 9. Licenciamento e observacoes

Este codigo e um exemplo academico gerado para o trabalho GeoPoint. Ainda nao inclui dados reais de alunos, links de servicos publicados nem resultados de testes executados em ambiente de nuvem. Adaptacoes e responsabilidades descritas no relatorio devem corresponder ao trabalho real do grupo.
