const {gql} = require('apollo-server-express');

const feedbackTypeDefs = gql`

    type Feedback {
        id: ID!
        event: Event!
        club: Club!
        questions: [Question!]
        comments: [String!]
        userHash: [String!]
    }
    
    type Question {
        question: String!
        rating: [Int!]
    }
    
    type Club {
        id: ID!
        name: String!
        createdBy: User!
        description: String!
        imageUrl: String!
        members: [User!]
    }
    
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
    
    type Query {
        getFeedback(id: ID!): Feedback
        getFeedbacks(userClubs: [String!]): [Feedback!]
    }
    
    type Mutation {
        createFeedbackForm(event: String!, club: String!, questions: [String!]): Feedback
        uploadFeedback(id: ID!, ratingList: [Int!], comment: String!): Feedback
        deleteFeedback(id: ID!): Boolean
    }
    
`;

module.exports = feedbackTypeDefs;