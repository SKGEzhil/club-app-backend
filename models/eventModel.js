const mongoose = require('mongoose');
const { Schema } = mongoose;

const eventModel = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    location: {
        type: String,
        required: true
    },
    bannerUrl: {
        type: String,
        required: true
    },
    club: {
        type: Schema.Types.ObjectId,
        ref: 'Club',
        required: true
    },
});

module.exports = mongoose.model('Event', eventModel);