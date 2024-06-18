const eventModel = require('../models/eventModel');
const ClubModel = require('../models/clubModel');
const feedbackModel = require('../models/feedbackModel');
const {GraphQLError} = require("graphql/index");
const sendNotification = require("../utils/sendNotification");
const crypto = require('crypto');

function generateUserHash(userId) {
    const crypto = require('crypto');
    const hash = crypto.createHash('sha256'); // Create a SHA-256 hash object
    hash.update(userId); // Add deviceId and current timestamp to the hash
    return hash.digest('hex'); // Compute the hash and return it as a hexadecimal string
}


const feedbackResolver = {
    Query: {
        getFeedback: async (_, { eventId }) => {
            try {
                const feedback = await feedbackModel.find({event: eventId}).populate('event');
                return feedback.populate('club');
            } catch (err) {
                throw new Error('Error retrieving feedback');
            }
        },

        getFeedbacks: async (_,{userClubs}, context) => {

            console.log('USERID', context.user.id);
            const userId = context.user.id;
            const hashedUserId = generateUserHash(userId);

            const isAdmin = context.user.role === 'admin';

            try {

                if(isAdmin){
                    const feedbacks = await feedbackModel.find().populate('event').populate('club');
                    return feedbacks;
                } else if (userClubs.length === 0) {
                    const feedbacks = await feedbackModel.find({
                        userHash: { $nin: [hashedUserId] }
                    }).populate('event').populate('club');
                    return feedbacks;
                } else {
                    // return all the feedback forms that user has not filled and if user filled a feedback form and user is also a member of that club then return that feedback form also
                    const feedbacks = await feedbackModel.find({
                        $or: [
                            { userHash: { $nin: [hashedUserId] } },
                            { club: { $in: userClubs } }
                        ]
                    }).populate('event').populate('club');
                    return feedbacks;
                }

            } catch (err) {
                console.error(err);
                throw new Error('Error retrieving feedbacks');
            }
        }

    },

    Mutation: {
        createFeedbackForm: async (_, {event, club, questions}, context) => {

            console.log("club", club)

            const club_ = await ClubModel.findOne({_id: club});
            console.log('event', await eventModel.findById(event))
            const eventName = (await eventModel.findById(event)).name;
            const isAuthorized = context.user.role === 'admin' || club_.members.includes(context.user.id);

            if (!isAuthorized) {
                console.log('Unauthorized')
                throw new GraphQLError('You are not authorized to perform this action.', {
                    extensions: {
                        code: 'FORBIDDEN',
                        status: 404,
                        message: 'Only admins or club members can create feedback forms.'
                    },
                });
            }

            try {
                const newFeedbackForm = new feedbackModel({
                    event: event,
                    club: club,
                    questions: questions.map(question => {
                        return {
                            question: question,
                            rating: [0, 0, 0, 0, 0]
                        }
                    },),
                    comments: [],
                    userHash: []
                });
                await newFeedbackForm.save();


                console.log('eventName', eventName)

                const message = {
                    data: {
                        largeIcon: `${(await  ClubModel.findOne({_id: club})).imageUrl}`, // *
                        image: ``,
                        title: `${eventName}`,
                        body: `Feedback forms are available for the event ${eventName}`,
                    },
                    topic: process.env.FCM_TOPIC,
                };
                sendNotification(message);

                return (await newFeedbackForm.populate('event')).populate('club');
            } catch (err) {
                console.error(err); // Log the error
                throw new Error("Error creating feedback form");
            }
        },

        uploadFeedback: async (_, {id, ratingList, comment}, context) => {

            const userId = context.user.id;
            const hashedUserId = generateUserHash(userId);
            console.log('hashedUserId', hashedUserId)
            const feedbackForm = await feedbackModel.findById(id);

            const userHash = feedbackForm.userHash;
            userHash.forEach((hash) => {
                console.log('hash', hash)
            });
            if(userHash.includes(hashedUserId)) {
                console.log('Already submitted feedback')
                throw new GraphQLError('You have already submitted feedback for this event.', {
                    extensions: {
                        code: 'FORBIDDEN',
                        status: 404,
                        message: 'You have already submitted feedback for this event.'
                    },
                });
            }

            try {

                const questions = feedbackForm.questions;
                const comments = feedbackForm.comments;

                if (comment !== "") {
                    comments.push(comment);
                }

                ratingList.forEach((rating, index) => {
                    questions[index].rating[rating - 1] += 1;
                });

                userHash.push(hashedUserId);

                const uploadFeedback = feedbackModel.findByIdAndUpdate(
                    id,
                    {questions, userHash, comments},
                    {new: true}
                );
                return (await uploadFeedback.populate('event')).populate('club');

            } catch (err) {
                console.error(err);
                throw new Error("Error creating feedback");
            }
        },

        deleteFeedback: async (_, {id}, context) => {
            const feedback = await feedbackModel.findById(id).populate('club').populate('event');
            const club = await ClubModel.findById(feedback.club.id);
            const isAuthorized = context.user.role === 'admin' || club.members.includes(context.user.id);

            if (!isAuthorized) {
                throw new GraphQLError('You are not authorized to perform this action.', {
                    extensions: {
                        code: 'FORBIDDEN',
                        status: 404,
                        message: 'Only admins or club members can delete feedback forms.'
                    },
                });
            }

            try {
                const deleteFeedback = await feedbackModel.findByIdAndDelete(id);
                return !!deleteFeedback;
            } catch (err) {
                console.error(err);
                throw new Error("Error deleting feedback form");
            }

        }
    }
}

module.exports = feedbackResolver;