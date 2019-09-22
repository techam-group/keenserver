const { AuthenticationError } = require( 'apollo-server' )

const userResolverMutations = {
  addUser: async ( _, { data }, { dataSources: { user } } ) => {
    return await new user().addUser( data )
  },

  loginUser: async ( _, { data }, { dataSources: { user } } ) => {
    return await new user().loginUser( data )
  },

  verifyEmail: async ( _, { emailToken }, { dataSources: { user } } ) => {
    return await new user().verifyEmail( emailToken )
  },

  updateUser: async ( _, { data }, { AuthUser, dataSources: { user } } ) => {
    return await new user().updateUser( data )
  },

  deleteUser: async ( _, { id }, { AuthUser, dataSources: { user } } ) => {
    if ( !AuthUser ) throw new AuthenticationError( "Not Authenticated, please login to continue..." )
    return await new user().deleteUser( id )
  }
}

module.exports = userResolverMutations