# Relatorio Final — GeoPoint API

> Modelo para preencher com dados verdadeiros da equipe. Nao e um relatorio final pronto para submeter.

## 4.1. Nome do Aplicativo

GeoPoint — [PERSONALIZACAO DEFINIDA PELO GRUPO]

## 4.2. Logo do Aplicativo

[INSERIR LOGO OU ICONE AQUI]

## 4.3. Integrantes do Grupo

| Nome completo (ordem alfabetica) | RA | E-mail institucional |
|---|---|---|
| [NOME] | [RA] | [EMAIL] |

## 4.4. Explicacao do Tema do Aplicativo

[DESCREVER O TEMA QUE O GRUPO REALMENTE ESCOLHEU, O PUBLICO E A FINALIDADE]

## 4.5. Descricao Tecnica do Back-End do Aplicativo

**Tecnologias:** Java 21, Spring Boot 3.5.16, PostgreSQL, JdbcTemplate, Maven, Bean Validation, Docker.

**Arquitetura:**
- Controller (`PointController`): recebe HTTP, retorna JSON e codigos HTTP.
- DTO (`PointRequest`, `PointResponse`): recebe e retorna os dados com validacao.
- Service (`PointService`): regras, existencia do ID e verificacao de nomes.
- Repository (`PointRepository`): consultas SQL parametrizadas no PostgreSQL com JdbcTemplate.
- Entity (`Point`): representa os campos de um ponto.
- Exceptions (`GlobalExceptionHandler`): 400, 404 e 500 com mensagens claras.

**Endpoints obrigatorios:**

| Metodo | Caminho | Finalidade | Exemplo cURL |
|---|---|---|---|
| POST | `/api/points` | Cadastrar | ver abaixo |
| GET | `/api/points` | Listar todos | ver abaixo |
| GET | `/api/points/{id}` | Consultar | ver abaixo |
| PUT | `/api/points/{id}` | Alterar | ver abaixo |
| DELETE | `/api/points/{id}` | Excluir | ver abaixo |

**POST:**
```bash
curl --location 'http://localhost:8080/api/points' --header 'Content-Type: application/json' --data-raw '{"name":"Praça Central","description":"Praça principal","latitude":-28.2825,"longitude":-52.7869}'
```

**GET todos:**
```bash
curl --location 'http://localhost:8080/api/points'
```

**GET por ID:**
```bash
curl --location 'http://localhost:8080/api/points/SEU_UUID'
```

**PUT:**
```bash
curl --location --request PUT 'http://localhost:8080/api/points/SEU_UUID' --header 'Content-Type: application/json' --data-raw '{"name":"Praça Central Renovada","description":"Praça revitalizada","latitude":-28.283,"longitude":-52.7875}'
```

**DELETE:**
```bash
curl --location --request DELETE 'http://localhost:8080/api/points/SEU_UUID'
```

> Ao publicar, substituir `http://localhost:8080` pela URL de producao e anexar exemplos que tenham sido testados. Acrescentar aqui endpoints extras, caso implementados.

## 4.6. Descricao da Contribuicao Individual

| Integrante | Contribuicao real no projeto |
|---|---|
| [NOME] | [O QUE DESENVOLVEU/TESTOU/DOCUMENTOU] |

## 4.7. Link do Repositorio do Back-End

[INSERIR LINK REAL DO GITHUB]

Se privado, compartilhar o acesso com `luciano-ferretto`.

## 4.8. Link da API em Producao (Nuvem)

[INSERIR URL HTTPS REAL DO DEPLOY]

**Testes feitos em producao:** [DESCREVER TESTES REAIS NO POSTMAN]

## Entrega

Converter este relatorio final revisado em PDF e enviar no AVA ate **29/11/2026**.
