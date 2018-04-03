const express = require('express');
const bodyParser = require('body-parser');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

const app = express();
const port = 3001;

// interesting, how to use middle ware
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    console.log(req.body);
    const todo = new Todo({
        text: req.body.text,
    });
    todo.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        // console.log(`Unable to save text ${err}`);
        res.status(400).send(err);
    });
});

app.listen(port, () => {
    console.log(`Server start listening at port ${port}`);
});
