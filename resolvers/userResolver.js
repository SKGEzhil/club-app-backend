const userModel = require('../models/userModel');

const userResolver = {
    Query: {
        getUser: async (_, { email }) => {
            try {
                const user = await userModel.findOne({ email: email });
                return user;
            } catch (err) {
                throw new Error('Error retrieving user');
            }
        },

        getUsers: async (_, {role}) => {
            try {
                const users = role !== '' ? await userModel.find({role: role}) : await userModel.find();
                // const users = await userModel.find();
                return users;
            } catch (err) {
                throw new Error('Error retrieving users');
            }
        }
    },

    Mutation: {
        createUser: async (_, { name, email, fcmToken }) => {
            try {
                console.log("name", name);
                const newUser = new userModel({
                    name: name,
                    email: email,
                    fcmToken: fcmToken,
                    role: 'user'
                });
                await newUser.save();
                const userId = newUser._id;
                console.log("userId", userId);
                return userModel.findById(userId);
            } catch (err) {
                throw new Error('Error creating user');
            }
        },

        updateUser: async (_, { email, role }) => {
            try {
                const userId = (await userModel.findOne({ email: email }))._id;
                const updatedUser = await userModel.findByIdAndUpdate(
                    userId,
                    { role },
                    { new: true }
                );
                return updatedUser;
            } catch (err) {
                throw new Error('Error updating user');
            }
        },

    },



}

module.exports = userResolver;