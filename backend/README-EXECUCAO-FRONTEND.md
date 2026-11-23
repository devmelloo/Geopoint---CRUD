# Integração com o frontend React

Este diretório contém a API Java/Spring Boot/PostgreSQL do ZIP recebido.

Para rodar localmente, instale Docker Desktop e execute nesta pasta:

```bash
docker compose up --build -d
```

Verifique `http://localhost:8080/api/points` e depois inicie o React na pasta acima com `npm install && npm run dev`. O React usa `VITE_API_URL=http://localhost:8080`.

Não execute `npm start` aqui: não é um backend Node.js. Para detalhes do banco e execução via IntelliJ, leia o README original ao lado.
