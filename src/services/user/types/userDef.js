const { gql } = require('apollo-server-express');

const userDef = gql`
  extend type Query {
    getUsers(filter: UserFilterInput): [User]
    getUser(id: ID!): User
    getCurrentUser(token: String!): User
    resendEmailVerification(email: String!): String!
    sendEmailVerification(id: ID!): String!
  }

  extend type Mutation {
    addUser(data: UserInput!): AddUserResponse
    addAdmin(data: UserInput!): AddUserResponse
    loginUser(data: UserLogin!): LoginResponse
    verifyEmail(emailToken: String!): String
    updateUser(data: UserInputUpdate): String
    deleteUser(id: ID!): String
  }

  type User {
    id: ID
    firstName: String
    lastName: String
    username: String
    email: String
    createdAt: DateTime
    updatedAt: DateTime
    role: [String]
    isActive: Boolean
    isVerified: Boolean
    membership: [String]
    posts: [Post]
  }
  
  type AddUserResponse {
      id: ID
      email: String
  }

  type LoginResponse {
    token: String
    role: [String]
  }

  input UserFilterInput {
    limit: Int
  }

  input UserLogin {
    usernameOrEmail: String!
    password: String!
  }

  input UserInput {
    username: String!
    firstName: String
    lastName: String
    password: String!
    email: String!
  }

  input UserInputUpdate {
    username: String
    firstName: String
    lastName: String
    role: Roles
    id: ID
  }

  enum Roles {
    Admin
    Editor
    Moderator
    User
  }
`;

module.exports = userDef;
