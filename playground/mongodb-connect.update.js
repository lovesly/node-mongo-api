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

    /**
     *  findOneAndUpdate
     */
    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('5abec82c6bc3a20b3587f397'),
    }, {
        $set: {
            name: 'luyi',
        },
        $inc: {
            age: -1,
        },
    }, {
        returnOriginal: false,
    }).then((result) => {
        console.log(result);
    });

    // client.close();
});

// how to remove/rename a collection,
