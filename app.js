const express = require("express");
const bodyParser = require("body-parser");
const router = require('./src/router.js');

const app = express();
const HTTP_PORT = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', router);

// Start server
app.listen(HTTP_PORT, () => {
    console.log(`Server running on port ${HTTP_PORT}`);
});

/*
                ОБЩИЕ КОММЕНТАРИИ К ПРОЕКТУ
    
    1.  Чтобы клиенты могли использовать API c разных доменов необходимо разблокировать CORS(Cross-Origin Resource Sharing)
        совместное использование ресурсов разными источниками, например для всех источников:

            app.use((req, res, next) => {
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
                next();
            });

        Более подробную информацию можно найти здесь: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS

    2.  Для работы с БД не используются подготовленные операторы (Prepared Statements), что повышает риск SQL-инъекций.
        Пример использования:
            
            const sql = `select * from article where id = ${req.params.id}`;
            const params = [];
            const ps=db.prepare(sql);
            ps.get(params, (err, row) => { ...some code... });

        либо:

            db.prepare(sql).get(params, (err, row) => { ...some code... });

    3.  При создании таблицы БД (database.js) я бы использовал CREATE TABLE IF NOT EXISTS.

    4.  В методах c использованием ID (выдать конкретную статью, редактировать, удалить) отсутствует его проверка на валидность. 
        После проверки ID в случае ошибки следует выдать ответ с кодом 400 (Bad Request). Также было бы неплохо ввести проверку 
        наличия записи с запрашиваемым ID в таблице БД.

    5.  Непонятно зачем в методах создания/редактирования (POST/PUT) в ответе возвращаются заголовок и содержимое статьи.
        По-моему вполне достаточно "Успешно" + ID.

    6.  В модуле router.js блоки типа:

            if (...)
            {
                ...
                return;
            }
        
        везде, где позволяет алгоритм, заменить на

            if (...)
            {
                ...
            }
            else
            {
                ...
            }

    7.  Добавить в конец стека обработчик кода 404 (Not Found) с выдачей списка валидных методов API
            
            app.use((req, res, next) => {
                res.status(404).send('... Список методов ...');
            });

        Также в модуле router.js дополнить списком методов ответ в router.get("/", (req, res, next)

    8.  В методе создания статьи (POST) вместо кода 200 лучше вернуть 201 (Created).

    9.  Обосновать наличие зависимостей lodash, md5, uuid в package.json

    10. Занести файл БД db.sqlite в .gitignore     
*/

