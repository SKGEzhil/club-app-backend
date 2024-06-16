const postModel = require('../models/postModel');
const ClubModel = require('../models/clubModel');
const admin = require("firebase-admin");
const {GraphQLError} = require("graphql/index");

const postResolver = {
    Query: {
        getPost: async (_, { id }) => {
            try {
                const post = await postModel.findById(id).populate('createdBy').populate('club');
                return post;
            } catch (err) {
                throw new Error('Error retrieving post');
            }
        },

        getPosts: async () => {
            try {
                const posts = await postModel.find().populate('createdBy').populate('club');
                return posts;
            } catch (err) {
                throw new Error('Error retrieving posts');
            }
        }

    },

    Mutation: {
        createPost: async (_, { content, imageUrl, createdBy, dateCreated, club }, context) => {

            console.log("club", club)

            const club_ = await ClubModel.findOne({_id: club});
            const isAuthorized = context.user.role === 'admin' || club_.members.includes(context.user.id);

            if(!isAuthorized) {
                console.log('Unauthorized')
                throw new GraphQLError('You are not authorized to perform this action.', {
                    extensions: {
                        code: 'FORBIDDEN',
                        status: 404,
                        message: 'Only club members can create posts.'
                    },
                });
            }

            try {
                const newPost = new postModel({
                    content: content,
                    imageUrl: imageUrl,
                    createdBy: createdBy,
                    dateCreated: dateCreated,
                    club: club
                });
                await newPost.save();
                const postId = newPost._id;
                console.log("postId", postId);
                const sendNotification = require('../utils/sendNotification');
                const clubbb =await  ClubModel.findOne({_id: club});
                console.log("clubbb", clubbb.name)
                const message = {
                    data: {
                        postId: `${postId}`,
                        clubId: `${newPost.club}`,
                        largeIcon: `${(await  ClubModel.findOne({_id: club})).imageUrl}`, // *
                        image: `${imageUrl}`,
                        title: `${(await  ClubModel.findOne({_id: club})).name}`,
                        body: `${content}`,
                    },
                    topic: process.env.FCM_TOPIC,
                };
                console.log(message.data.largeIcon)
                sendNotification(message);
                return postModel.findById(postId).populate('createdBy').populate('club');
            } catch (err) {
                throw new Error('Error creating post');
            }
        },

        updatePost: async (_, { id, content }, context) => {

            const post_ = await postModel.findOne({_id: id});
            console.log("post_", post_.id)
            const club_ = await ClubModel.findOne({_id: post_.club});
            console.log("club_", club_.name)
            const isAuthorized = context.user.role === 'admin' || club_.members.includes(context.user.id);

            if(!isAuthorized) {
                console.log('Unauthorized')
                throw new GraphQLError('You are not authorized to perform this action.', {
                    extensions: {
                        code: 'FORBIDDEN',
                        status: 404,
                        message: 'Only club members can modify posts.'
                    },
                });
            }

            try {
                const post = await postModel.findByIdAndUpdate(
                    id,
                    { content },
                    { new: true }
                ).populate('createdBy').populate('club');
                console.log("post", post.id)
                return post;
            } catch (err) {
                console.log(err)
                throw new Error('Error updating post');
            }
        },

        deletePost: async (_, { id }, context) => {

            const post_ = await postModel.findOne({_id: id});
            console.log("post_", post_.id)
            const club_ = await ClubModel.findOne({_id: post_.club});
            console.log("club_", club_.name)
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
                const post = await postModel.findByIdAndDelete(id);
                console.log("post", !!post)
                return !!post;
            } catch (err) {
                console.log(err)
                throw new Error('Error deleting post');
            }
        }
    }
}

module.exports = postResolver;