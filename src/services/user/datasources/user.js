const { UserInputError, AuthenticationError } = require('apollo-server-express');

const Base = require('../../../base')
const User = require('../../../models/users/users.schema')

class user extends Base {
  // Mutations

  /*
  * addUser to DB
  * @params: data
  * returns: new user
  */
  async addUser(data) {
    if (!data) throw new UserInputError('No provided credentials')

    const foundEmail = await User.findOne({ email: data.email })

    if (foundEmail) {
      throw new AuthenticationError(`User with ${data.email} already exists`)
    }

    data.password = await this.hashPassword(data.password)

    const user = await User.create(data)

    if (user) {
      user.emailVerificationToken = await this.getEmailVerifierToken(user.username)
      await user.save()

      const message = await this.getEVTTemplate('Registration was successful', user.emailVerificationToken)
      const subject = 'Account Verification'

      this.sendMail(user.email, message, subject)

      return 'Registration Successful'
    }
  }

  /*
  * loginUser in DB
  * @params: data
  * returns: token and user data
  */
  async loginUser(data) {
    if (!data) throw new UserInputError('No provided credentials')

    try {
      const { usernameOrEmail, password } = data
      const user = await User.findOne({
        $or: [
          { username: usernameOrEmail },
          { email: usernameOrEmail }
        ]
      })

      if (!user) {
        return new UserInputError('No user found, please verify provided username or email ')
      }

      const isValid = await this.comparePassword(password, user.password)

      if (!isValid) {
        return new UserInputError('Incorrect password ')
      }

      const payload = {
        id: user._id,
        username: user.username,
        email: user.email
      }
      const token = await this.createToken(payload)

      return { token }
    } catch (error) {
      return error.message
    }
  }


  /*
  * emailVerificationrue
  * @query: token
  * returns: string
  */
  async verifyEmail(data) {
    try {
      const isValid = await this.verifyEmailToken(data)

      if (isValid) {
        const user = await User.findOne({ emailVerificationToken: data })

        if (user.isVerified) return 'User is already verified, please continue to login...'

        if (user) {
          user.emailVerificationToken = null
          user.isVerified = true

          await user.save()

          return '🚀 Verification Successful'
        }
      }
    } catch (error) {
      if (error.message.includes('expired')) {
        return 'Your email verification token has expired.'
      } else {
        return error.message
      }
    }
  }


  /*
  * updateUser in DB
  * @params: data
  * returns: String
  */
  async updateUser(data) {
    if (!data) throw new UserInputError('No provided credentials')

    try {
      const updatedUser = await User.updateOne(
        { _id: id },
        { $set: { data } },
        { new: true }
      );

      if (updatedUser.ok === 1) return 'update successful'
    } catch (e) {
      throw new Error(e)
    }
  }

  /*
  * deleteUser from DB
  * @params: id
  * returns: String
  */
  async deleteUser(id) {
    if (!id) throw new UserInputError('No provided ID')

    try {
      const deleted = await User.findOneAndDelete({ _id: id })
      if (deleted) return 'user deleted'
    } catch (e) {
      throw new Error('Invalid User ID')
    }
  }

  // Queries

  /*
  * getUsers
  * returns: an array of all users
  */
  async getUsers(filter) {
    return await User.find({}, null, filter).
      select('-password -__v').
      populate('posts')
  }

  /*
  * getUser
  * @params: ID
  * returns: a single user
  */
  async getUser(id) {
    if (!id) throw new UserInputError('No provided ID')

    try {
      return await User.findById(id).
        select('-password -__v').
        populate('posts')
    } catch (e) {
      throw new Error('Ivalid user ID')
    }
  }

  /*
  * getCurrentUser
  * @params: token
  * returns: a single user
  */
  async getCurrentUser(token) {
    if (!token) throw new UserInputError('No provided token')

    try {
      const user = await jwt.verify(token, process.env.SECRET_KEY)

      return await User.findOne({ _id: user.id }).select('-password -__v')
    } catch (e) {
      throw new Error('Ivalid token')
    }
  }


  /*
  * resendEmailVerification
  * @params: ID
  * returns: a string
  */
  async resendEmailVerification(id) {
    try {
      const foundUser = await User.findById(id)

      if (!foundUser) throw new AuthenticationError('User not found')

      if (foundUser.isVerified) return "You have already been verified. Please continue to login..."

      foundUser.emailVerificationToken = await this.getEmailVerifierToken(id)

      await foundUser.save()

      const message = await this.getEVTTemplate('Email Verification', foundUser.emailVerificationToken, 'resend')
      const subject = 'Account Verification'

      this.sendMail(foundUser.email, message, subject)

      return "Your verification token has been sent successfully, Check your email to continue"
    } catch (e) {
      throw new Error('Ivalid post ID')
    }
  }

  /*
  * sendEmailVerification
  * @params: ID
  * returns: a string
  */
  async sendEmailVerification(id) {
    try {
      const foundUser = await User.findById(id)

      if (!foundUser) throw new AuthenticationError('User not found')

      if (foundUser.isVerified) return 'Already verified'

      foundUser.emailVerificationToken = await this.getEmailVerifierToken(id)

      await foundUser.save()

      const message = await this.getEVTTemplate('Email Verification', foundUser.emailVerificationToken, 'resend')
      const subject = 'Account Verification'

      this.sendMail(foundUser.email, message, subject)

      return "Your verification token has been sent successfully, Check your email to continue"
    } catch (e) {
      throw new Error('Ivalid post ID')
    }
  }
}

module.exports = user