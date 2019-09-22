const { AuthenticationError, UserInputError } = require( 'apollo-server' )

const Base = require( '../../../base' )
const Post = require( '../../../models/posts/posts.schema' )
const User = require( '../../../models/users/users.schema' )

class post extends Base {
  // Mutations

  /*
  * addPost to DB
  * @params: data
  * returns: new Post
  */
  async addPost( data, AuthUser ) {
    if ( !data ) throw new UserInputError( 'Please provide the required fields' )

    try {
      const payload = {
        ...data,
        author: AuthUser.id
      }

      const user = await User.findOne( { _id: AuthUser.id } )
      const post = await Post.create( payload )

      user.posts.push( post._id )

      await user.save()
      return post
    } catch ( error ) {
      return error.message;
    }
  }

  /*
  * updatePost in DB
  * @params: data
  * returns: String
  */
  async updatePost( data, AuthUser ) { // TODO
    if ( !data ) throw new UserInputError( 'Please provide the required fields' )

    try {
      const foundPost = await Post.findOne(
        { _id: data.id }
      ).where( { author: AuthUser.id } )

      if ( foundPost ) {
        const updatedPost = await Post.updateOne( {
          _id: data.id
        }, { $set: data }, { new: true } )
        if ( updatedPost ) return 'update successful'
      } else {
        throw new AuthenticationError( 'You are not the creator of the post' )
      }
    } catch ( error ) {
      return error.message
    }
  }

  /*
  * changeLikeState of post
  * @params: id!
  * returns: String
  */
  async changeLikeState( id ) { // TODO
    if ( !id ) throw new UserInputError( 'No provided ID' )

    try {
      const updatePost = await Post.updateOne(
        { _id: id },
        { $set: { likes: 1 } },
        { new: true }
      );

      if ( updatePost.ok === 1 ) return 'update successful'
    } catch ( e ) {
      throw new Error( e )
    }
  }

  /*
  * changePublishState of post
  * @params: id!
  * returns: String
  */
  async changePublishState( id ) {
    if ( !id ) throw new UserInputError( 'No provided ID' )

    try {
      const updatePost = await Post.updateOne(
        { _id: id },
        { $set: { isPublished: true } },
        { new: true }
      );

      if ( updatePost.ok === 1 ) return 'update successful'
    } catch ( e ) {
      throw new Error( e )
    }
  }

  /*
  * deletePost from DB
  * @params: id
  * returns: String
  */
  async deletePost( id, AuthUser ) {
    if ( !id ) throw new UserInputError( 'No provided ID' )

    try {
      const post = await Post.findOne( { _id: id } )
      const author = await User.findOne( { _id: AuthUser.id } )

      author.posts.pop( post._id )
      await author.save()

      const deletedPost = await Post.deleteOne( { _id: post._id } )

      if ( deletedPost ) return 'post deleted successfully'
    } catch ( e ) {
      throw new Error( 'Invalid Post ID' )
    }
  }

  // Queries

  /*
  * getAllPosts
  * returns: an array of all posts
  */
  async getAllPosts( filter ) {
    try {
      return await Post.find( {}, null, filter ).populate( {
        path: 'author',
        model: 'User'
      } )
    } catch ( e ) {
      return new Error( e.message )
    }
  }

  /*
  * getAllPublishedPosts
  * returns: an array of all published posts
  */
  async getAllPublishedPosts( filter ) {
    try {
      return await Post.find( {
        isPublished: true
      }, null, filter ).populate( {
        path: 'author',
        model: 'User'
      } )
    } catch ( e ) {
      return new Error( e.message )
    }
  }

  /*
  * getAllUserPublishedPosts
  * returns: an array of all published posts by a user
  */
  async getAllUserPublishedPosts( filter, AuthUser ) {
    try {
      return await Post.find( {
        isPublished: true
      }, null, filter ).
        where( { author: AuthUser.id } ).
        populate( {
          path: 'author',
          model: 'User'
        } )
    } catch ( e ) {
      return new Error( e.message )
    }
  }

  /*
  * getUserPosts
  * @params: ID
  * returns: an array of posts for a user
  */
  async getUserPosts( filter, AuthUser ) {
    try {
      return await Post.find( {}, null, filter ).
        where( { author: AuthUser.id } ).
        populate( {
          path: 'author',
          model: 'User'
        } )
    } catch ( e ) {
      throw new Error( e.message )
    }
  }

  /*
  * getPost
  * @params: id
  * returns: a single post
  */
  async getPost( id ) {
    if ( !id ) throw new UserInputError( 'No provided ID' )

    try {
      return await Post.findOne( { _id: id } ).select( '-__v' ).populate( {
        path: 'author',
        model: 'User'
      } )
    } catch ( e ) {
      throw new Error( 'Ivalid ID' )
    }
  }
}

module.exports = post