const ClubModel = require('../models/clubModel');
const eventModel = require('../models/eventModel');
const admin = require("firebase-admin");
const {GraphQLError} = require("graphql/index");
const postModel = require("../models/postModel");

const eventResolver = {
    Query: {
        getEvent: async (_, { id }) => {
            try {
                const event = await eventModel.findById(id).populate('club');
                return event;
            } catch (err) {
                throw new Error('Error retrieving event');
            }
        },

        getEvents: async () => {
            try {
                const events = await eventModel.find().populate('club');
                return events;
            } catch (err) {
                throw new Error('Error retrieving events');
            }
        }

    },

    Mutation: {

        createEvent: async (_, { name, description, date, location, bannerUrl, club }, context) => {

            console.log("club", club)

            const club_ = await ClubModel.findOne({_id: club});
            const isAuthorized = context.user.role === 'admin' || club_.members.includes(context.user.id);

            if(!isAuthorized) {
                console.log('Unauthorized')
                throw new GraphQLError('You are not authorized to perform this action.', {
                    extensions: {
                        code: 'FORBIDDEN',
                        status: 404,
                        message: 'Only club members can create events.'
                    },
                });
            }

            try {
                const newEvent = new eventModel({
                    name: name,
                    description: description,
                    date: date,
                    location: location,
                    bannerUrl: bannerUrl,
                    club: club
                });
                await newEvent.save();
                return newEvent.populate('club');
            } catch (err) {
                throw new Error("Error creating event");
            }
        },

        updatePost: async (_, { id, name, description, date, location, bannerUrl, club }, context) => {

                const club_ = await ClubModel.findOne({_id: club});
                const isAuthorized = context.user.role === 'admin' || club_.members.includes(context.user.id);

                if(!isAuthorized) {
                    console.log('Unauthorized')
                    throw new GraphQLError('You are not authorized to perform this action.', {
                        extensions: {
                            code: 'FORBIDDEN',
                            status: 404,
                            message: 'Only club members can update events.'
                        },
                    });
                }

                try {
                    const event = await eventModel.findByIdAndUpdate(
                        id,
                        { name, description, date, location, bannerUrl},
                        { new: true }
                    );
                    return event.populate('club');
                } catch (err) {
                    throw new Error("Error updating event");
                }
        },

        deleteEvent: async (_, { id }, context) => {

            const event_ = await eventModel.findOne({_id: id});
            const club_ = await ClubModel.findOne({_id: event_.club});
            const isAuthorized = context.user.role === 'admin' || club_.members.includes(context.user.id);

            if(!isAuthorized) {
                console.log('Unauthorized')
                throw new GraphQLError('You are not authorized to perform this action.', {
                    extensions: {
                        code: 'FORBIDDEN',
                        status: 404,
                        message: 'Only club members or admins can modify or delete posts.'
                    },
                });
            }

            try {
                const event = await eventModel.findByIdAndDelete(id);
                console.log("post", !!event)
                return !!event;
            } catch (err) {
                console.log(err)
                throw new Error('Error deleting post');
            }

        }

    }

}

module.exports = eventResolver;