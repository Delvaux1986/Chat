const mongoose = require('mongoose');

let messagesSchema = new mongoose.Schema({
    
    user: {
        type: String
    },
    message: {
        type: String
    },
    date: {
        type: Date
    }
});


module.exports = mongoose.model('Chat' , messagesSchema);