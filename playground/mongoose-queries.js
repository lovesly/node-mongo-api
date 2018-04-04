const { ObjectID } = require('mongodb');

const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');

const id = '5ac313fa3767c07c2d81a29b11';
if (!ObjectID.isValid(id)) {
    console.log('Invalid Id');
}

// Todo.find({
//     _id: id,
// }).then((todos) => {
//     console.log(`Todos: ${todos}`);
// });

// return the first one
// Todo.findOne();

Todo.findById(id).then((todo) => {
    if (!todo) {
        return console.log('Id not found');
    }
    console.log(`Todo: ${todo}`);
}).catch((err) => {
    console.log(err);
});
