const { gql } = require( 'apollo-server' )

const userDef = gql`
  extend type Query {
    getUsers(filter: UserFilterInput): [User]
    getUser(id: ID!): User
    getCurrentUser(token: String!): User
    resendEmailVerification(id: ID!): String!
    sendEmailVerification(id: ID!): String!
  }

  extend type Mutation {
    addUser(data: UserInput!): String!
    loginUser(data: UserLogin!): LoginResponse!
    verifyEmail(emailToken: String!): String!
    updateUser(data: UserInputUpdate): String!
    deleteUser(id: ID!): String
  }

  type User {
    id: ID!
    firstName: String
    lastName: String
    username: String!
    email: String!
    role: [String]
    isActive: Boolean
    isVerified: Boolean
    membership: [String]
    posts: [Post]
  }

  type LoginResponse {
    token: String
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
    role: String
  }

  enum Roles {
    ADMIN
    EDITOR
    MODERATOR
    USER
  }
`

module.exports = userDef