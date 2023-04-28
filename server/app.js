const express = require('express')
const mongoose = require('mongoose')

const app = express()

const mongoConnectionString = "mongodb://localhost:27017/SomeDB"

mongoose.connect(mongoConnectionString, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    family: 4,
}).then(() => {
    console.log('Database connected')
});

const userRoutes = require('./routes/userRoutes')
const postRoutes = require('./routes/postRoutes')
const followRoutes = require('./routes/followRoutes')

app.use('/users', userRoutes)
app.use('/user', followRoutes)
app.use('/posts', postRoutes)

app.use(express.json())

app.listen(3000, () => {
    console.log('listening on http://localhost:3000/')
})