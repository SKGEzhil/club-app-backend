const {gql} = require('apollo-server-express');

const clubTypeDefs = gql`
    type Club {
        id: ID!
        name: String!
        createdBy: User!
        description: String!
        imageUrl: String!
        members: [User!]
    }
    
    type User {
        id: ID!
        name: String!
        email: String!
    }
    
    type Query {
        getClub(id: ID!): Club
        getClubs: [Club!]
    }
    
    type Mutation {
        createClub(name: String!, description: String!, imageUrl: String!, createdBy: String!): Club
        joinClub(clubId: ID!, userId: ID!): Club
    }
    
`;

module.exports = clubTypeDefs;