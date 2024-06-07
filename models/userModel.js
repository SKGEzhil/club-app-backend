const mongoose = require('mongoose');

const userModel = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    fcmToken: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['user', 'admin']
    }

});

module.exports = mongoose.model('User', userModel);
