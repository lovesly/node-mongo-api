require('./config/config');
const express = require('express');
const _ = require('lodash');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');
const { authenticate } = require('./middleware/authenticate');

const app = express();
// port set up for Heroku
const port = process.env.PORT || 3001;

app.use(bodyParser.json());

/**
 *  todo apis
 *  post, get, patch, delete
 */
app.post('/todos', authenticate, (req, res) => {
    console.log(req.body);
    const todo = new Todo({
        text: req.body.text,
        _creator: req.user._id,
    });
    todo.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        // console.log(`Unable to save text ${err}`);
        res.status(400).send(err);
    });
});

app.get('/todos', authenticate, (req, res) => {
    Todo.find({
        _creator: req.user._id,
    }).then((todos) => {
        res.send({
            todos,
        });
    }, (err) => {
        res.status(400).send(err);
    });
});

app.get('/todos/:id', authenticate, (req, res) => {
    const { id } = req.params;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    Todo.findOne({
        _id: id,
        _creator: req.user._id,
    }).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        res.status(200).send({ todo });
    }).catch(err => res.status(400).send(err));
});

app.delete('/todos/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        if (!ObjectID.isValid(id)) {
            return res.status(404).send();
        }
        const todo = await Todo.findOneAndRemove({
            _id: id,
            _creator: req.user._id,
        });
        if (!todo) {
            return res.status(404).send();
        }
        res.status(200).send({ todo });
    } catch (e) {
        res.status(400).send(e);
    }

    // Todo.findOneAndRemove({
    //     _id: id,
    //     _creator: req.user._id,
    // }).then((todo) => {
    //     if (!todo) {
    //         return res.status(404).send();
    //     }
    //     res.status(200).send({ todo });
    // }).catch(err => res.status(400).send(err));
});

app.patch('/todos/:id', authenticate, (req, res) => {
    const { id } = req.params;
    const body = _.pick(req.body, ['text', 'completed']);
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }
    Todo.findOneAndUpdate({
        _id: id,
        _creator: req.user._id,
    }, {
        $set: body,
    }, {
        new: true,
    }).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        res.status(200).send({ todo });
    }).catch(err => res.status(400).send(err));
});

/**
 *  user apis
 *  post
 */
app.post('/users', async (req, res) => {
    try {
        const body = _.pick(req.body, ['email', 'password']);
        const user = new User(body);
        await user.save();
        const token = await user.generateAuthToken();
        res.header('x-auth', token).send(user.toJSON());
    } catch (e) {
        res.status(400).send(e);
    }
    // user.save().then(() => {
    //     return user.generateAuthToken();
    // }).then((token) => {
    //     res.header('x-auth', token).send(user.toJSON());
    // }).catch(err => res.status(400).send(err));
});

// use authenticate middleware
// header: x-auth token
app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

// each time we login, we get a new token? yes
// new async/await version
app.post('/users/login', async (req, res) => {
    try {
        const body = _.pick(req.body, ['email', 'password']);
        const user = await User.findByCrendentials(body.email, body.password);
        const token = await user.generateAuthToken();
        res.header('x-auth', token).send(user);
    } catch (e) {
        res.status(400).send(e);
    }

    // User.findByCrendentials(body.email, body.password).then((user) => {
    //     return user.generateAuthToken().then((token) => {
    //         res.header('x-auth', token).send(user);
    //     });
    // }).catch(err => res.status(400).send(err));
});

app.delete('/users/me/token', authenticate, async (req, res) => {
    try {
        await req.user.removeToken(req.token);
        res.status(200).send();
    } catch (e) {
        res.status(400).send();
    }

    // req.user.removeToken(req.token).then(() => {
    //     res.status(200).send();
    // }, () => {
    //     res.status(400).send();
    // });
});

app.listen(port, () => {
    console.log(`Server start listening at port ${port}`);
});

module.exports = { app };
