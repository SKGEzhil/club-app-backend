const {gql} = require('apollo-server-express');

const eventTypeDefs = gql`

    type Event {
        id: ID!
        name: String!
        description: String!
        date: String!
        createdAt: String!
        location: String!
        bannerUrl: String!
        club: Club!
    }
    
    type Club {
        id: ID!
        name: String!
        createdBy: User!
        description: String!
        imageUrl: String!
        members: [User!]
    }
    
    type Query {
        getEvent(id: ID!): Event
        getEvents: [Event!]
    }
    
    type Mutation {
        createEvent(name: String!, description: String!, date: String!, location: String!, bannerUrl: String!, club: String!): Event
        updateEvent(id: ID!, name: String!, description: String!, date: String!, location: String!, club: String!): Event
        deleteEvent(id: ID!): Boolean
    }

`;

module.exports = eventTypeDefs;