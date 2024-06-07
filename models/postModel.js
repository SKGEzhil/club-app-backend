const mongoose = require('mongoose');
const { Schema } = mongoose;

const postModel = new Schema({

    content: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
    },
    createdBy: {
        type: String,
        ref: 'User',
        required: true
    },
    dateCreated: {
        type: Date,
        required: true
    },
    club: {
        type: String,
        ref: 'Club',
        required: true
    }
});

module.exports = mongoose.model('Post', postModel);