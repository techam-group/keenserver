const { AuthenticationError } = require( 'apollo-server' )

const userResolverQueries = {
  getUsers: async ( _, { filter = {} }, { AuthUser, dataSources: { user } } ) => {
    if ( !AuthUser ) throw new AuthenticationError( "Not Authenticated, please login to continue..." )

    return await new user().getUsers( filter )
  },

  getUser: async ( _, { id }, { AuthUser, dataSources: { user } } ) => {
    if ( !AuthUser ) throw new AuthenticationError( "Not Authenticated, please login to continue..." )

    return await new user().getUser( id )
  },

  getCurrentUser: async ( _, { token }, { AuthUser, dataSources: { user } } ) => {
    if ( !AuthUser ) throw new AuthenticationError( "You are not Authenticated... Please log in." )
    return await new user().getCurrentUser( token )
  },

  resendEmailVerification: async ( _, { id }, { dataSources: { user } } ) => {
    return await new user().resendEmailVerification( id )
  },

  sendEmailVerification: async ( _, { id }, { AuthUser, dataSources: { user } } ) => {
    if ( !AuthUser ) throw new AuthenticationError( 'You are not Authenticated...' )
    return await new user().sendEmailVerification( id )
  }
}

module.exports = userResolverQueries