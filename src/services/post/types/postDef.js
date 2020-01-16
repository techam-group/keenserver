const { gql } = require('apollo-server-express');

const postDef = gql`
  extend type Query {
    getAllPublishedPosts: [Post]
    getAllPosts: [Post]
    getUserPosts: [Post]
    getAllUserPublishedPosts: [Post]
    getPost(id: ID): Post
  }

  extend type Mutation {
    addPost(data: postInput): String!
    updatePost(data: updatePostInput): String
    changeLikeState(id: ID!): String
    changePublishState(id: ID!): String
    deletePost(id: ID!): String
  }

  type Post {
    id: ID
    title: String
    body: String
    image: String
    likes: Int
    isPublished: Boolean
    isDraft: Boolean
    isPaid: Boolean
    createdAt: String
    updatedAt: String
    category: [String]
    comments: [Comment]
    author: User
  }

  # There is going to be a comment service, so this will leave here soon
  type Comment {
    id: ID
    comment: String
    author: User
    likes: Int
    isFlagged: Boolean
  }

  input postInput {
    title: String!
    body: String
    category: String
    image: String
    isPublished: Boolean
  }

  input updatePostInput {
    id: ID!
    title: String
    body: String
    category: String
    image: String
    isPublished: Boolean
  }
`;

module.exports = postDef;
