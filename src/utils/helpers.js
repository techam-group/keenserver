const SECRET = process.env.APP_SECRET
const jwt = require("jsonwebtoken")

module.exports = {
  getUser: async (token) => {
    try {
      if (token) {
        token = token.split(' ')[1]
        const AuthUser = await jwt.verify(token, SECRET)
        return AuthUser
      }
      return null
    } catch (err) {
      return null
    }
  }
}
