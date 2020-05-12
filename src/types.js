const { gql } = require('apollo-server-express');

// Get all defined types
const postDef = require('./services/post/types/postDef');
const userDef = require('./services/user/types/userDef');

const linkSchema = gql`
   scalar JSON
   scalar DateTime

  type Mutation {
    _: Boolean
  }

  type Query {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }
`;

module.exports = [
  linkSchema,
  userDef,
  postDef
];
