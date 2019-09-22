const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  firstName: {
    type: String,
    minlength: 2
  },
  lastName: {
    type: String,
    minlength: 2
  },
  username: {
    type: String,
    required: true,
    minlength: 3,
    unique: true
  },
  email: {
    type: String,
    required: true,
    minlength: 8,
    unique: true
  },
  password: {
    type: String,
    minlength: 6
  },
  role: {
    type: [String],
    enum: ['Admin', 'Editor', 'Moderator', 'User'],
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  membership: {
    type: [String],
    enum: ['free', 'premium_monthly', 'premium_yearly'],
    default: ['free']
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Post'
    }
  ]
}, { timestamps: true }
)

const User = mongoose.model('User', userSchema)

module.exports = User