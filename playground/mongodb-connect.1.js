const { MongoClient, ObjectID } = require('mongodb');

// const obj = new ObjectID();
// console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

    const db = client.db('TodoApp');
    // 1
    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed: false,
    // }, (err, res) => {
    //     if (err) {
    //         return console.log('Unable to insert todos');
    //     }
    //     console.log(JSON.stringify(res.ops, undefined, 4));
    // });

    db.collection('Users').insertOne({
        name: 'sly',
        age: 27,
        location: 'China',
    }, (err, res) => {
        if (err) {
            return console.log('Unable to insert user');
        }
        console.log(JSON.stringify(res.ops, undefined, 4));
        // insteresting, how did it recover the time stamp
        console.log(res.ops[0]._id.getTimestamp());
    });

    client.close();
});
