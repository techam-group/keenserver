const { AuthenticationError } = require('apollo-server-express');

const postResolverQueries = {
  getAllPosts: async (parent, fields, { AuthUser, dataSources: { post } }) => {
    // if (!AuthUser) throw new AuthenticationError("Not Authenticated, please login to continue...");

    return await new post().getAllPosts();
  },

  getAllPublishedPosts: async (parent, fields, { dataSources: { post } }) => {
    return await new post().getAllPublishedPosts();
  },

  getAllUserPublishedPosts: async (parent, fields, { AuthUser, dataSources: { post } }) => {
    if (!AuthUser) throw new AuthenticationError("Not Authenticated, please login to continue...");

    return await new post().getAllUserPublishedPosts(null, AuthUser);
  },

  getUserPosts: async (parent, fields, { AuthUser, dataSources: { post } }) => {
    if (!AuthUser) throw new AuthenticationError("Not Authenticated, please login to continue...");

    return await new post().getUserPosts(null, AuthUser);
  },

  getPost: async (_, { id }, { AuthUser, dataSources: { post } }) => {
    if (!AuthUser) throw new AuthenticationError("Not Authenticated, please login to continue...");

    return await new post().getPost(id);
  },

  countPosts: async (_, args, {AuthUser, dataSources: {post}}) => {
    if (!AuthUser) throw new AuthenticationError("Not Authenticated, please login to continue...");
    return await new post().countPosts(AuthUser);
  },

  countBlog: async (_, args, {AuthUser, dataSources: {post}}) => {
    if (!AuthUser) throw new AuthenticationError("Not Authenticated, please login to continue...");
    return await new post().countBlog(AuthUser);
  },

  countTutorials: async (_, args, {AuthUser, dataSources: {post}}) => {
    if (!AuthUser) throw new AuthenticationError("Not Authenticated, please login to continue...");
    return await new post().countTutorials(AuthUser);
  },

  countSeries: async (_, args, {AuthUser, dataSources: {post}}) => {
    if (!AuthUser) throw new AuthenticationError("Not Authenticated, please login to continue...");
    return await new post().countSeries(AuthUser);
  },

  getAllTutorials: async (_, args, {AuthUser, dataSources: {post}}) => {
    return await new post().getAllTutorials(null);
  }
};

module.exports = postResolverQueries;
