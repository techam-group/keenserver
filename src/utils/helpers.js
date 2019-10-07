const { SECRET_KEY } = process.env
const jwt = require("jsonwebtoken")

module.exports = {
  getUser: async (token) => {
    try {
      if (token) {
        token = token.split(' ')[1]
        const AuthUser = await jwt.verify(token, SECRET_KEY)
        return AuthUser
      }
      return null
    } catch (err) {
      return null
    }
  }
}
