const mongoose = require('mongoose');

let usersSchema = new mongoose.Schema({
    
    username: {
        type: String
    },
    password: {
        type: String
    }
});


module.exports = mongoose.model('User' , usersSchema);