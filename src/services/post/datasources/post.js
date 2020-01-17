const { AuthenticationError, UserInputError } = require('apollo-server-express');

const Base = require('../../../base');
const Post = require('../../../models/posts/posts.schema');
const User = require('../../../models/users/users.schema');

class post extends Base {
  // Mutations

  /*
  * addPost to DB
  * @params: data
  * returns: new Post
  */
  async addPost(data, AuthUser) {
    if (!data) throw new UserInputError('Please provide the required fields');

    const post = await Post.findOne({
      $or: [{title: data.title}, {_id: data.id}]
    }).where({ author: AuthUser.id });

    if (post) {
      post.title = data.title;
      post.body = data.body;
      post.category = data.category;
      post.isPublished = data.isPublished;
      post.image = data.image;

      await post.save();
      return 'post updated'
    }

    const payload = {
      ...data,
      author: AuthUser.id
    };

    const user = await User.findOne({_id: AuthUser.id});
    const newPost = await Post.create(payload);

    user.posts.push(newPost._id);
    await user.save();
    return 'post created...';
  }

  /*
  * changeLikeState of post
  * @params: id!
  * returns: String
  */
  async changeLikeState(id) { // TODO
    if (!id) throw new UserInputError('No provided ID');

    try {
      const updatePost = await Post.updateOne(
        { _id: id },
        { $set: { likes: 1 } },
        { new: true }
      );

      if (updatePost.ok === 1) return 'update successful'
    } catch (e) {
      throw new Error(e)
    }
  }

  /*
  * changePublishState of post
  * @params: id!
  * returns: String
  */
  async changePublishState(id) {
    if (!id) throw new UserInputError('No provided ID');

    const post = await Post.findOne({_id: id});

    if (!post) new UserInputError('No post found with such ID');

    if (post.isPublished) {
      post.isPublished = false;
      await post.save();

      return 'post reverted to draft';
    } else {
      post.isPublished = true;
      await post.save();

      return 'post has been published';
    }
  }

  /*
  * deletePost from DB
  * @params: id
  * returns: String
  */
  async deletePost(id, AuthUser) {
    if (!id) throw new UserInputError('No provided ID');

    try {
      const post = await Post.findOne({ _id: id });
      const author = await User.findOne({ _id: AuthUser.id });

      author.posts.pop(post._id);
      await author.save();

      const deletedPost = await Post.deleteOne({ _id: post._id });

      if (deletedPost) return 'post deleted successfully'
    } catch (e) {
      throw new Error('Invalid Post ID')
    }
  }

  // Queries

  /*
  * getAllPosts
  * returns: an array of all posts
  */
  async getAllPosts(filter) {
    try {
      return await Post.find({}, null, filter).populate({
        path: 'author',
        model: 'User'
      })
    } catch (e) {
      return new Error(e.message)
    }
  }

  /*
  * getAllPublishedPosts
  * returns: an array of all published posts
  */
  async getAllPublishedPosts(filter) {
    try {
      return await Post.find({
        isPublished: true
      }, null, filter).populate({
        path: 'author',
        model: 'User'
      })
    } catch (e) {
      return new Error(e.message)
    }
  }

  /*
  * getAllUserPublishedPosts
  * returns: an array of all published posts by a user
  */
  async getAllUserPublishedPosts(filter, AuthUser) {
    try {
      return await Post.find({
        isPublished: true
      }, null, filter).
        where({ author: AuthUser.id }).
        populate({
          path: 'author',
          model: 'User'
        })
    } catch (e) {
      return new Error(e.message)
    }
  }

  /*
  * getUserPosts
  * @params: ID
  * returns: an array of posts for a user
  */
  async getUserPosts(filter, AuthUser) {
    try {
      return await Post.find({}, null, filter).
        where({ author: AuthUser.id }).
        populate({
          path: 'author',
          model: 'User'
        })
    } catch (e) {
      throw new Error(e.message)
    }
  }

  /*
  * getPost
  * @params: id
  * returns: a single post
  */
  async getPost(id) {
    if (!id) throw new UserInputError('No provided ID');

    try {
      return await Post.findOne({ _id: id }).select('-__v').populate({
        path: 'author',
        model: 'User'
      })
    } catch (e) {
      throw new Error('Ivalid ID')
    }
  }
}

module.exports = post;
