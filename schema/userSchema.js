const {gql} = require('apollo-server-express');

const userTypeDefs = gql`

    type User {
        id: ID!
        name: String!
        email: String!
        fcmToken: String!
        role: String!
        photoUrl: String!
    }
    
    type Query {
        getUser(email: String!): User
        getUsers(role: String!): [User!]
    }
    
    type Mutation {
        createUser(name: String!, email: String!, fcmToken: String!, photoUrl: String!): User
        updateUser(email: String!, role: String!): User
    }

`;

module.exports = userTypeDefs;