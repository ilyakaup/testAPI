const express = require('express');
const db = require("./database.js");

const router = express.Router();

router.get("/api/articles", (req, res, next) => {
    const sql = "select * from article";                
    const params = [];
    db.all(sql, params, (err, rows) => {                // Использовать Prepared Statements
        if (err) {
          res.status(403).json({"error":err.message});
          return;                                       // убрать return, использовать if () {...} else {...}
        }
        res.json({
            "message":"Успешно",
            "data":rows
        })
      });
});

router.get("/api/article/:id", (req, res, next) => {
    const sql = `select * from article where id = ${req.params.id}`;    // проверить ID на валидность
    const params = [];                                                  
    db.get(sql, params, (err, row) => {                                 // Использовать Prepared Statements
        if (err) {
          res.status(403).json({"error":err.message});
          return;                                                       // убрать return, использовать if () {...} else {...}
        }
        console.log('row: ', row);                                      // проверить row на undefined, вернуть код ошибки
        res.json({
            "message":"Успешно",
            "data":row
        });
      });
});

router.post("/api/article/", (req, res, next) => {
    const errors=[];
    if (!req.body.title){
        errors.push("title обязательно");
    }
    if (!req.body.body){
        errors.push("body обязателен");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    const data = {
        title: req.body.title,
        body: req.body.body,
        date: req.body.date
    };
    const sql ='INSERT INTO article (title, body, date) VALUES (?,?,?)';    
    const params =[data.title, data.body, data.date];
    db.run(sql, params, function (err, result) {                            // Использовать Prepared Statements
        if (err){
            res.status(403).json({"error": err.message});
            return;                                                         // убрать return, использовать if () {...} else {...}
        }
        
        res.json({
            "message": "Успешно",
            "data": data,
            "id" : this.lastID
        });                                                                 // вернуть код 201
    });
});

router.put("/api/article/:id", (req, res, next) => {
    const data = {
        title: req.body.title,
        body: req.body.body
    };
    console.log(data);                                                      // проверить ID на валидность
                                                                            // Использовать Prepared Statements
    db.run(
        `UPDATE article set 
           title = COALESCE(?,title),
           body = COALESCE(?,body)
           WHERE id = ?`,
        [data.title, data.body, req.params.id],
        (err, result) => {
            if (err){
                console.log(err);
                res.status(403).json({"error": res.message});
                return;                                                     // убрать return, использовать if () {...} else {...}
            }
            res.json({
                message: "Успешно",
                data: data
            });
    });
});

router.delete("/api/article/:id", (req, res, next) => {                     // проверить ID на валидность
    db.run(
        'DELETE FROM article WHERE id = ?',                                 // Использовать Prepared Statements
        req.params.id,
        function (err, result) {
            if (err){
                res.status(403).json({"error": res.message});
                return;                                                     // убрать return, использовать if () {...} else {...}
            }
            res.json({"message":"Удалено", rows: this.changes});
    });
});

// Если никуда не попали
router.get("/", (req, res, next) => {
    res.json({"message":"Ok"});                                             // дополнить ответ списком доступных методов
});

module.exports = router;