const mongoose = require('mongoose');
const { Schema } = mongoose;

const feedbackModel = new Schema({
    event: {
        type: Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    club: {
        type: Schema.Types.ObjectId,
        ref: 'Club',
        required: true
    },
    questions: [
        {
            question: {
                type: String,
                required: true
            },
            rating: {
                type: [Number, Number, Number, Number, Number],
                default: [0, 0, 0, 0, 0],
                required: true
            }
        }
    ],
    comments: {
        type: [String],
        required: true
    },
    userHash: {
        type: [String],
        required: true
    }
});

module.exports = mongoose.model('Feedback', feedbackModel);