const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postSchema = new Schema({
  title: {
    type: String,
    trim: true,
    minlength: 3,
    required: true
  },
  image: {
    type: String
  },
  body: {
    type: String,
    trim: true
  },
  likes: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  isDraft: {
    type: Boolean,
    default: true
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  category: {
    type: [String],
    enum: ['blog', 'vlog', 'series', 'tutorial'],
    required: true
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }

}, { timestamps: true }
)

const Post = mongoose.model('Post', postSchema)

module.exports = Post