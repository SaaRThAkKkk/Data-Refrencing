const express = require('express');
const app = express();

const userModel = require('./models/user')
const postModel = require('./models/post')

app.get('/',(req,res) => {
    res.send('heyyy!!!')
})

app.listen(3000);