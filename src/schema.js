const { Query , Mutation , Subscription } = require( './resolvers' );
const typeDefs = require( './types' );
const { GraphQLDateTime } = require( 'graphql-iso-date' );
const GraphQLJSON = require( 'graphql-type-json' );

const resolvers = {
  Query ,
  Subscription ,
  Mutation ,
  JSON : GraphQLJSON ,
  DateTime : GraphQLDateTime
};

module.exports = {
  typeDefs ,
  resolvers
};
