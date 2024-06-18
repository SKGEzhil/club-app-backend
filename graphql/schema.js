const { gql } = require('apollo-server');

const clubSchema = require('../schema/clubSchema');
const userSchema = require('../schema/userSchema');
const postSchema = require('../schema/postSchema');
const eventSchema = require('../schema/eventSchema');
const feedbackSchema = require('../schema/feedbackSchema');

const typeDefs = gql`
    ${clubSchema}
    ${userSchema}
    ${postSchema}
    ${eventSchema}
    ${feedbackSchema}
`;

module.exports = typeDefs;