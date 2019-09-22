// Import Mutations
const userMutations = require('./services/user/resolvers/mutations/userMutations')
const postMutations = require('./services/post/resolvers/mutations/postMutations')

// Import Queries
const userQueries = require('./services/user/resolvers/queries/userQueries')
const postQueries = require('./services/post/resolvers/queries/postQueries')

module.exports = {
  Query: {
    ...userQueries,
    ...postQueries
  },

  Mutation: {
    ...userMutations,
    ...postMutations
  }
}