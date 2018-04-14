const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const { Todo } = require('./../../models/todo');
const { User } = require('./../../models/user');

const user1Id = new ObjectID();
const user2Id = new ObjectID();

const users = [{
    _id: user1Id,
    email: 'zz@outlook.com',
    password: 'password',
    tokens: [{
        access: 'auth',
        token: jwt.sign({ _id: user1Id, access: 'auth' }, 'abc123').toString(),
    }],
}, {
    _id: user2Id,
    email: 'sly@outlook.com',
    password: 'password2',
}];

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo',
    _creator: user1Id,
}, {
    _id: new ObjectID(),
    text: 'Second test todo V2',
    completed: true,
    completedAt: 123,
    _creator: user2Id,
}];

// eslint-disable-next-line
const populateTodos = function(done) {
    // I'm superised that insert 2 docs cost more than 2000ms
    // actually remove cost 1050ms, insert cost 1034ms.
    this.timeout(5000);
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => {
        done();
    });
};

// eslint-disable-next-line
const populateUsers = function(done) {
    this.timeout(5000);
    User.remove({}).then(() => {
        const user1 = new User(users[0]).save();
        const user2 = new User(users[1]).save();
        Promise.all([user1, user2]).then(() => done());
    });
};

module.exports = {
    todos,
    populateTodos,
    users,
    populateUsers,
};
