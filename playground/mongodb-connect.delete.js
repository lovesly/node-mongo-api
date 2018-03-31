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
     * deleteMany
     */
    // db.collection('Users').deleteMany({ name: 'chao' }).then((result) => {
    //     console.log(result);
    // });

    /**
     * deleteOne
     * if multiple, remove first one
     */
    // db.collection('Users').deleteOne({ name: 'Zhao' }).then((result) => {
    //     console.log(result);
    // });

    /**
     * findOneAndDelete
     */
    db.collection('Users').findOneAndDelete({ name: 'yixuan' }).then((result) => {
        console.log(result);
    });
    // client.close();
});
