const express = require('express')
const bodyParser = require('body-parser')
const User = require('../models/User')

const router = express.Router()

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

router.patch('/follow/:username', async (req, res) => {
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

router.patch('/unfollow/:username', async (req, res) => {
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

module.exports = router