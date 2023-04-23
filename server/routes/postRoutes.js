const express = require('express')
const bodyParser = require('body-parser')
const Posts = require('../models/Posts')
const User = require('../models/User')

const router = express.Router()

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

router.post('/', async (req, res) => {
    try {
        const { title, content, date, username } = req.body

        if (username !== await User.findOne({ username: username })) {
            return res.status(400).json({ message: 'User does not exist' })
        }

        const post = new Posts({
            title: title,
            content: content,
            date: date,
            username: username
        })

        try {
            post.save()
            res.json({ message: 'Post successfully created', post })
        } catch (err) {
            res.status(err.status).json({ message: 'Post not created successfully', error: err.message })
        }

    } catch (err) {
        res.status(err.status).json({ message: 'An error occured', error: err.message })
    }
})

router.get('/', async (req, res) => {
    try {
        res.json( await Posts.find() )
    } catch (err) {
        res.status(err.status).json({ message: 'An error occured', error: err.message })
    }
})

router.get('/:username', async (req, res) => {
    try {
        const { username } = req.params
        const posts = await Posts.find({ username: username })
        res.json(posts)
    } catch (err) {
        res.status(err.status).json({ message: 'An error occured', error: err.message })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params
        await Posts.findByIdAndDelete(id)
        res.json({ message: 'Post delete succesfully' })
    } catch (err) {
        res.status(err.status).json({ message: 'An error occured', error: err.message })
    }
})

module.exports = router