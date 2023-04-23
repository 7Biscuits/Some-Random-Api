const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    minlength: 6,
    required: true,
  },
  role: {
    type: String,
    default: "Basic",
    required: true,
  },
  userData: { 
    type: Object,
    default: {"followers": [], "following": [], "posts": []},
    required: true,
  },
}, { minimize: false } )

const User = mongoose.model('user', UserSchema)

module.exports = User