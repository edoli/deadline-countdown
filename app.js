const express = require('express');
const shortid = require('shortid');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);

const app = express();
const port = 3428;

db.defaults({schedules: []}).write();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.get('/schedules/get', (req, res) => res.json({result: db.get('schedules').value()}));

app.post('/schedules/update', (req, res) => {
    let schedules_db = db.get('schedules');
    let schedule_db = schedules_db.find({id: req.body.id});
    if (schedule_db.value()) {
        schedule_db.assign({
            name: req.body.name,
            date: req.body.date
        }).write();
    } else {
        schedules_db.push({
            id: shortid.generate(),
            name: req.body.name,
            date: req.body.date
        }).write();
    }
    res.send('ok');
});

app.post('/schedules/delete', (req, res) => {
    let schedules_db = db.get('schedules');
    schedules_db.remove({id: req.body.id}).write();
    res.send('ok');
});

app.listen(port, "0.0.0.0");