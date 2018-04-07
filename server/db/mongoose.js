
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// heroku mongodb add-on uri
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp');

module.exports = {
    mongoose,
};
