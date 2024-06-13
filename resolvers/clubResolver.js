
const ClubModel = require('../models/clubModel');
const UserModel = require('../models/userModel');
const PostModel = require('../models/postModel');
const {GraphQLError} = require("graphql/index");

const clubResolver = {

    Query: {
        getClub: async (_, { id }) => {
            try {
                const club = await ClubModel.findById(id).populate('members').populate('createdBy');
                return club;
            } catch (err) {
                throw new Error('Error retrieving club');
            }
        },

        getClubs: async () => {
            try {
                const clubs = await ClubModel.find().populate('members').populate('createdBy');
                return clubs;
            } catch (err) {
                throw new Error('Error retrieving clubs');
            }
        }

    },

    Mutation: {
        createClub: async (_, { name, description, imageUrl, createdBy }) => {
            try {
                console.log("name", name);
                const newClub = new ClubModel({
                    name: name,
                    createdBy: createdBy,
                    description: description,
                    imageUrl: imageUrl,
                    members: [createdBy]
                });
                await newClub.save();
                const clubId = newClub._id;
                console.log("clubId", clubId);
                await PostModel.create({
                    content: `Welcome to the club! Get to know about the events of ${name} here.`,
                    imageUrl: '',
                    createdBy: createdBy,
                    dateCreated: new Date(),
                    club: clubId
                })
                return ClubModel.findById(clubId).populate('members').populate('createdBy');
            } catch (err) {
                throw new Error('Error creating club');
            }
        },

        updateClub: async (_, { id, name, description, imageUrl }, context) => {

            const club_ = await ClubModel.findOne({_id: id});
            const isAuthorized = context.user.role === 'admin' || club_.members.includes(context.user.id);

            if(!isAuthorized) {
                console.log('Unauthorized')
                throw new GraphQLError('You are not authorized to perform this action.', {
                    extensions: {
                        code: 'FORBIDDEN',
                        status: 404,
                        message: 'Only club members or admins can change club info'
                    },
                });
            }

            try {
                const club = await ClubModel.findByIdAndUpdate(
                    id,
                    { name, description, imageUrl },
                    { new: true }
                );
                club.save();
            } catch (err) {
                throw new Error('Error updating club');
            }

        },

        addToClub: async (_, { clubId, userEmail }, context) => {

            const club = await ClubModel.findOne({_id: clubId});
            const isAuthorized = context.user.role === 'admin' || club.members.includes(context.user.id);

            if(!isAuthorized) {
                console.log('Unauthorized')
                throw new GraphQLError('You are not authorized to perform this action.', {
                    extensions: {
                        code: 'FORBIDDEN',
                        status: 404,
                        message: 'Only club members or admins can add or remove users.'
                    },
                });
            }

            const user = await UserModel.findOne({ email: userEmail });

            if (!user) {
                throw new GraphQLError('You are not authorized to perform this action.', {
                    extensions: {
                        code: 'FORBIDDEN',
                        status: 404,
                        message: 'User not found.'
                    },
                });
            }

            try {
                club.members.push(user._id);
                await club.save();
                return club;
            } catch (err) {
                throw new Error('Error joining club');
            }
        },

        removeFromClub: async (_, { clubId, userEmail }, context) => {

            const club = await ClubModel.findOne({_id: clubId});
            const isAuthorized = context.user.role === 'admin' || club.members.includes(context.user.id);

            if(!isAuthorized) {
                console.log('Unauthorized')
                throw new GraphQLError('You are not authorized to perform this action.', {
                    extensions: {
                        code: 'FORBIDDEN',
                        status: 404,
                        message: 'Only club members or admins can add or remove users.'
                    },
                });
            }

            try {
                const user = await UserModel.findOne({ email: userEmail });
                if (!user) {
                    throw new Error('User not found');
                }

                console.log('club.members', club.members)

                const index = club.members.indexOf(user._id);
                console.log('index', index)
                if (index > -1) {
                    club.members.splice(index, 1);
                }
                await club.save();
                console.log('club.members', club.members)
                return club;
            } catch (err) {
                throw new Error('Error leaving club');
            }
        },

        deleteClub: async (_, { id }, context) => {
            const isAuthorized = context.user.role === 'admin';

            if(!isAuthorized) {
                console.log('Unauthorized')
                throw new GraphQLError('You are not authorized to perform this action.', {
                    extensions: {
                        code: 'FORBIDDEN',
                        status: 404,
                        message: 'Only admins can delete a club.'
                    },
                });
            }

            try {
                console.log('id', id);
                const club = await ClubModel.findByIdAndDelete(id);
                await PostModel.deleteMany({club: id});
                return !!club;
            } catch (err) {
                throw new Error('Error deleting club');
            }
        }

    }

}

module.exports = clubResolver;