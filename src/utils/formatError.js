const { AuthenticationError, UserInputError, ValidationError, ForbiddenError } = require('apollo-server-express');

module.exports = (err) => {
  if (err.originalError instanceof AuthenticationError) {
    return err;
  }

  if (err.originalError instanceof UserInputError) {
    return err;
  }

  if (err.originalError instanceof ValidationError) {
    return err;
  }

  if (err.originalError instanceof ForbiddenError) {
    return err;
  }

  if (err.extensions.exception.stacktrace[0].includes('GraphQLError')) {
    return err;
  }

  console.log(`Server Error: ${JSON.stringify(err, null, 1)}`)
  return new Error('Internal server error');
};
