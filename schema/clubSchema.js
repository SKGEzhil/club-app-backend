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
        fcmToken: String!
        role: String!
        photoUrl: String!
    }
    
    type Query {
        getClub(id: ID!): Club
        getClubs: [Club!]
    }
    
    type Mutation {
        createClub(name: String!, description: String!, imageUrl: String!, createdBy: String!): Club
        updateClub(id: ID!, name: String, description: String, imageUrl: String): Club
        addToClub(clubId: ID!, userEmail: String!): Club
        removeFromClub(clubId: ID!, userEmail: String!): Club
    }
    
`;

module.exports = clubTypeDefs;