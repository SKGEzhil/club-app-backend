const { mergeResolvers } = require("@graphql-tools/merge");

const clubResolvers = require('../resolvers/clubResolver');
const userResolvers = require('../resolvers/userResolver');
const postResolvers = require('../resolvers/postResolver');

const resolvers = mergeResolvers([clubResolvers, userResolvers, postResolvers]);

module.exports = resolvers;