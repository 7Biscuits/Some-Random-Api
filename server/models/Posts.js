const mongoose = require('mongoose')

const PostSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    }
})

Post = mongoose.model('posts', PostSchema)

module.exports = Post