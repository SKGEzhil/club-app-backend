
const ClubModel = require('../models/clubModel');
const UserModel = require('../models/userModel');

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
                return ClubModel.findById(clubId).populate('members').populate('createdBy');
            } catch (err) {
                throw new Error('Error creating club');
            }
        },

        joinClub: async (_, { clubId, userId }) => {
            try {
                const club = await ClubModel.findById(clubId);
                if (!club) {
                    throw new Error('Club not found');
                }
                const user = await UserModel.findById(userId);
                if (!user) {
                    throw new Error('User not found');
                }

                club.members.push(userId);
                await club.save();
                return club;
            } catch (err) {
                throw new Error('Error joining club');
            }
        }
    }

}

module.exports = clubResolver;