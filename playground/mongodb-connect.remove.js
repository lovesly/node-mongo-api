const { ObjectID } = require('mongodb');

const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');

// Todo.remove({}).then((res) => {
//     console.log(res);
// });

Todo.findOneAndRemove({
    _id: '5ac47ca40928ca65a089267a',
}).then((res) => {
    console.log(res);
});

Todo.findByIdAndRemove('5ac47ca40928ca65a089267a').then((res) => {
    console.log(res);
});
