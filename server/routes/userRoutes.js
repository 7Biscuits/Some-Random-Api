const express = require('express')
const bodyParser = require('body-parser')
const User = require('../models/User')

const router = express.Router()

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body

        const user = await User.find({ username: username, password: password })

        if (!user) {
            return res.status(401).json({ message: 'Login failed', error: 'Incorrect username or password' })
        }
        res.json({ message: 'Login successful', user })

    } catch (err) {
        res.status(err.status).json({ message: 'An error occured', error: err.message })
    }
})

router.post('/register', async (req, res) => {
    try {
        const { username, password, userData } = req.body

        if (username) {
            if (!await User.findOne({ username: username })) {
                if (password.length >= 6) {
                    const user = new User({
                        username: username,
                        password: password,
                        userData: userData
                    })
                    try {
                        user.save()
                        res.json({ message: 'User successfully created', user })
                    } catch (err) {
                        res.status(err.status).json({ message: 'User not created successfully', error: err.message })
                    }
                } else return res.status(401).json({ message: 'Password less than 6 characters' })
            } else return res.status(400).json({ message: 'username already in use' })
        } else return res.status(400).json({ message: 'Invalid username' })
    } catch (err) {
        res.status(err.status).json({ message: 'An error occured', error: err.message })
    }
})

router.get('/', async (req, res) => {
    try {
        res.json(await User.find())
    } catch (err) {
        res.status(400).send({ message: "Couldn't find users" })
    }
})

router.get('/:username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username })

        if (!user) return res.status(400).json({ message: 'User not found' })

        res.json(user)
    } catch (err) {
        res.status(err.status).json({ message: 'An error occured', error: err.message })
    }
})

router.put('/follow/:username', async (req, res) => {
    try {
        const currentUser = await User.findOne({ username: req.body.username })
        const userToFollow = await User.findOne({ username: req.params.username })

        if (!currentUser || !userToFollow) return res.status(404).json({ message: 'User not found' })

        if (currentUser.username == userToFollow.username) return res.status(400).json({ message: "You can't follow yourself" })

        if (currentUser.userData.following.includes(userToFollow.username)) return res.status(400).json({ message: 'You are already following this user' })

        await User.updateOne(currentUser, { $push: { 'userData.following': userToFollow.username } })
        await User.updateOne(userToFollow, { $push: { 'userData.followers': currentUser.username } })

        res.json({ message: 'You are now following this user' })

    } catch (err) {
        res.status(err.status).json({ message: 'An error occured', error: err.message })
    }
})

router.put('/unfollow/:username', async (req, res) => {
    try {
        const currentUser = await User.findOne({ username: req.body.username })
        const userToUnfollow = await User.findOne({ username: req.params.username })

        if (!currentUser || !userToUnfollow) return res.status(404).json({ message: 'User not found' })

        if (currentUser.username == userToUnfollow.username) return res.status(400).json({ message: "You can't follow yourself" })

        if (!currentUser.userData.following.includes(userToUnfollow.username)) return res.status(400).json({ message: "You do not follow this user" })

        await User.updateOne(currentUser, { $pull: { 'userData.following': userToUnfollow.username } })
        await User.updateOne(userToUnfollow, { $pull: { 'userData.followers': currentUser.username } })

        res.json({ message: 'You have unfollowed this user' })

    } catch (err) {
        res.status(err.status).json({ message: 'An error occured', error: err.message })
    }
})

router.delete('/:username', async (req, res) => {
    try {
        await User.findOneAndDelete({ username: req.params.username })
        res.json({ message: 'User successfully deleted' })
    } catch (err) {
        res.status(err.status).json({ message: 'An error occured', error: err.message })
    }
})

router.delete('/', async (req, res) => {
    try {
        await User.deleteMany({})
        res.json({ message: 'All users deleted successfully' })
    } catch (err) {
        res.json({ message: 'An error occured', error: err.message })
    }
})

module.exports = router