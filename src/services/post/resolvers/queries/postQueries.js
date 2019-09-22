const { AuthenticationError } = require('apollo-server')

const postResolverQueries = {
  getAllPosts: async (parent, fields, { AuthUser, dataSources: { post } }) => {
    if (!AuthUser) throw new AuthenticationError("Not Authenticated, please login to continue...")

    return await new post().getAllPosts();
  },

  getAllPublishedPosts: async (parent, fields, { AuthUser, dataSources: { post } }) => {
    if (!AuthUser) throw new AuthenticationError("Not Authenticated, please login to continue...")

    return await new post().getAllPublishedPosts();
  },

  getAllUserPublishedPosts: async (parent, fields, { AuthUser, dataSources: { post } }) => {
    if (!AuthUser) throw new AuthenticationError("Not Authenticated, please login to continue...")

    return await new post().getAllUserPublishedPosts(null, AuthUser);
  },

  getUserPosts: async (parent, fields, { AuthUser, dataSources: { post } }) => {
    if (!AuthUser) throw new AuthenticationError("Not Authenticated, please login to continue...")

    return await new post().getUserPosts(null, AuthUser);
  },

  getPost: async (_, { id }, { AuthUser, dataSources: { post } }) => {
    if (!AuthUser) throw new AuthenticationError("Not Authenticated, please login to continue...")

    return await new post().getPost(id);
  }
};

module.exports = postResolverQueries;
