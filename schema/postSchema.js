const {gql} = require('apollo-server-express');

const postTypeDefs = gql`

    type Post {
        id: ID!
        content: String!
        imageUrl: String!
        createdBy: User!
        dateCreated: String!
        club: Club!
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
        getPost(id: ID!): Post
        getPosts: [Post!]
    }
    
    type Mutation {
        createPost(content: String!, imageUrl: String!, createdBy: String!, dateCreated: String!, club: String!): Post
        updatePost(id: ID!, content: String): Post
        deletePost(id: ID!): Boolean
    }

`;

module.exports = postTypeDefs;