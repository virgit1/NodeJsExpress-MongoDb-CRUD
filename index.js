const express = require('express');
const mongojs = require('mongojs');
const db = mongojs('mongodb://127.0.0.1:27017/test', ['inventory'])
const app = express();
const port = 3000;
const path = require('node:path');
const {ObjectID} = require("mongojs");

app.use(express.urlencoded({extended:true}));

// use templates
app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res) => {
    db.inventory.drop();
    res.send('Hello World!');
});


app.get('/inventory', (req, res) => {
    db.inventory.find((err, docs) => {
        if (err) {
            res.send(err);
        } else {
            res.render('inventory', {elements: docs})
        }
    })
});

app.post('/inventory/guardar', (req, res) => {
    db.inventory.insertOne(
        { "item" : req.body.item,
            "qty" : req.body.qty,
            "size" : JSON.parse(req.body.size),
            "status" : req.body.status
        }
    )
    res.redirect('/inventory');
    db.inventory.find((err, docs) => {
        if (err) {
            res.send(err);
        } else {
            res.render('inventory', {elements: docs})
        }
    })
});

app.post('/inventory/actualizar/:id', (req, res) => {
    db.inventory.update({"_id": ObjectID(req.params.id)},
        {"$set":{ "item" : req.body.item,
            "qty" : req.body.qty,
            "size" : JSON.parse(req.body.size),
            "status" : req.body.status
        }}
    );
    res.redirect('/inventory');
    db.inventory.find((err, docs) => {
        if (err) {
            res.send(err);
        } else {
            res.render('inventory', {elements: docs})
        }
    });
});

app.get('/edit/:id', (req, res) => {
    db.inventory.find({"_id": ObjectID(req.params.id)}, (err, docs) => {
        if (err) {
            res.send(err);
        } else {
            res.render('create', {elements: docs});
        }
    });

});

app.get('/delete/:id', (req, res) => {
    db.inventory.remove({"_id": ObjectID(req.params.id)});
    console.log(req.params.id);
    console.log("hola");
    res.redirect('/inventory');
    db.inventory.find((err, docs) => {
        if (err) {
            res.send(err);
        } else {
            res.render('inventory', {elements: docs})
        }
    })
});

app.get('/create', (req, res) => {
        res.sendFile(path.join(__dirname + '/public/create.html'));
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
