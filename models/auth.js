const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        required: true,
        type: String,
        min: 6
    },
    email: {
        required: true,
        type: String,
        min: 6
    },
    password: {
        required: true,
        type: String,
        min: 6,
        max: 256
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('User', userSchema);