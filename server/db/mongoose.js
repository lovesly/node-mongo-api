
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// heroku mongodb add-on uri
mongoose.connect(process.env.MONGODB_URI);

module.exports = {
    mongoose,
};
