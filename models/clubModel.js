const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const clubModel = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    createdBy: {
        type: String,
        ref: 'User',
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    members: {
        type: [Schema.Types.ObjectId],
        ref: 'User',
    },
});

module.exports = mongoose.model('Club', clubModel);
