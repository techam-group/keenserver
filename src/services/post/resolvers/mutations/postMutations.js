const { AuthenticationError } = require('apollo-server-express')

const postResolverMutations = {
  // Add new post
  addPost: async (_, { data }, { AuthUser, dataSources: { post } }) => {
    if (!AuthUser) throw new AuthenticationError("Not Authenticated, please login to continue...")

    return await new post().addPost(data, AuthUser)
  },

  // Update post
  updatePost: async (_, { data }, { AuthUser, dataSources: { post } }) => {
    if (!AuthUser) throw new AuthenticationError("Not Authenticated, please login to continue...")

    return await new post().updatePost(data, AuthUser)
  },

  // change like state of a post
  changeLikeState: async (_, { id }, { AuthUser, dataSources: { post } }) => {
    if (!AuthUser) throw new AuthenticationError("Not Authenticated, please login to continue...")

    return await new post().changeLikeState(id)
  },

  // change published state of a post
  changePublishState: async (_, { id }, { AuthUser, dataSources: { post } }) => {
    if (!AuthUser) throw new AuthenticationError("Not Authenticated, please login to continue...")

    return await new post().changePublishState(id)
  },

  // Delete Post by ID
  deletePost: async (_, { id }, { AuthUser, dataSources: { post } }) => {
    if (!AuthUser) throw new AuthenticationError("Not Authenticated, please login to continue...")

    return await new post().deletePost(id, AuthUser)
  }
}

module.exports = postResolverMutations