const postModel = require('../models/postModel');
const ClubModel = require('../models/clubModel');
const admin = require("firebase-admin");

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
        createPost: async (_, { content, imageUrl, createdBy, dateCreated, club }) => {

            console.log("club", club)
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
                        largeIcon: `${(await  ClubModel.findOne({_id: club})).imageUrl}`, // *
                        image: `${imageUrl}`,
                        title: `${(await  ClubModel.findOne({_id: club})).name}`,
                        body: `${content}`,
                    },
                    topic: "clubs-app-fcm",
                };
                console.log(message.data.largeIcon)
                sendNotification(message);
                return postModel.findById(postId).populate('createdBy').populate('club');
            } catch (err) {
                throw new Error('Error creating post');
            }
        },

        updatePost: async (_, { id, title, content, imageUrl }) => {
            try {
                const post = await postModel.findByIdAndUpdate(
                    id,
                    { title, content, imageUrl },
                    { new: true }
                );
                return post;
            } catch (err) {
                throw new Error('Error updating post');
            }
        },

        deletePost: async (_, { id }) => {
            try {
                const post = await postModel.findByIdAndRemove(id);
                return post;
            } catch (err) {
                throw new Error('Error deleting post');
            }
        }
    }
}

module.exports = postResolver;