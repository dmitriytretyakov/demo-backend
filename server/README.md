Необходимо настроить доступы к БД в файле src/data-source.ts, также необходимо создать вручную БД

1. npm i
2. npm start

Примеры запросов:

GET http://0.0.0.0:8000/api/user/auth - получение JWT токена
GET http://0.0.0.0:8000/api/user/state - получение количества кликов
POST http://0.0.0.0:8000/api/user/state - добавление новых кликов, в запросе body: {clicks_count: number}

При вызове state нужно указывать в заголовках Authorization: Bearer <JWT token>

