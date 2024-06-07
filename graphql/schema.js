const { gql } = require('apollo-server');

const clubSchema = require('../schema/clubSchema');
const userSchema = require('../schema/userSchema');
const postSchema = require('../schema/postSchema');

const typeDefs = gql`
    ${clubSchema}
    ${userSchema}
    ${postSchema}
`;

module.exports = typeDefs;