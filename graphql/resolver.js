const { mergeResolvers } = require("@graphql-tools/merge");

const clubResolvers = require('../resolvers/clubResolver');
const userResolvers = require('../resolvers/userResolver');
const postResolvers = require('../resolvers/postResolver');
const eventResolvers = require('../resolvers/eventResolver');
const feedbackResolvers = require('../resolvers/feedbackResolver');

const resolvers = mergeResolvers([clubResolvers, userResolvers, postResolvers, eventResolvers, feedbackResolvers]);

module.exports = resolvers;