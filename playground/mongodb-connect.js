const { MongoClient, ObjectID } = require('mongodb');

// const obj = new ObjectID();
// console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');
    // create db instance
    const db = client.db('TodoApp');
    // chose a collection
    // db.collection('Users').find({ name: 'sly' }).toArray().then((docs) => {
    //     console.log('Users');
    //     console.log(JSON.stringify(docs, undefined, 4));
    // }, err => console.log('Unable to fetch users', err));

    db.collection('Users').find().count().then((count) => {
        console.log(`Users count: ${count}`);
    }, err => console.log('Unable to fetch users', err));

    // client.close();
});
