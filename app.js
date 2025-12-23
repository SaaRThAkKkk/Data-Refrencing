const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const userModel = require('./models/user');
const postModel = require('./models/post');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(cookieParser());


app.get('/',(req,res) => {
    res.render('index');
})
app.get('/login',(req,res) => {
    res.render('login');
})

app.get('/profile', isloggedin , async (req,res) => {
    let user = await userModel.findOne({email : req.user.email}).populate('posts');
    //we are getting the user so we can send the user to the profile page for viewing it
    res.render('profile',{user});
})

app.post('/register', async (req,res) => {
    let {email, password, username, age , name} = req.body;
    let user = await userModel.findOne({email : email});
    if(user) return res.status(500).send('user already registered');
    //if user is not registered then encrypt the password and create a new user in the data base
    bcrypt.genSalt(10, (err,salt) => {
        bcrypt.hash(password,salt,async (err,hash) => {
            let user = await userModel.create({
                username,
                name,
                age,
                email,
                password: hash
            })
            let token = jwt.sign({email : email , userid : user._id}, "shhhh");
            res.cookie('token',token);
            res.send("registered");

        })
        
    })


})

app.post('/login', async (req,res) => {
    let {email, password} = req.body;
    //check is user is already exisiting 
    let user = await userModel.findOne({email : email});
    if(!user) return res.status(500).send('Something went wrong!!');
    //if user is not present he can't simply log in 

    bcrypt.compare(password,user.password,(err,result) =>{
        if(result){
            let token = jwt.sign({email : email , userid : user._id}, "shhhh");
            res.cookie('token',token);
            res.status(200).redirect('/profile');
        }
        else res.redirect('/login');
    })
})

//logout route
app.get('/logout',(req,res) => {
    res.cookie('token',"")
    res.redirect('/login');
})

//creating a middleware for the protected routes it will only allow to do the furtehr tasks if the user is already logged in
function isloggedin(req,res,next){
    //if this opens to a new url there will be no cookie so it will ask to sign in first
    if(req.cookies.token === "") res.redirect('/login');
    else {
        //compare the token got as per the password 
        let data = jwt.verify(req.cookies.token,"shhhh");
        //creating a request field and feeding the data user into it {email and password}
        req.user = data;
    }
    next();
}

//route to create a post
app.post('/post', isloggedin ,async (req,res) => {
    let user =await userModel.findOne({email : req.user.email});
    let {content}=req.body;
    let post = await postModel.create({
        user : user._id,
        content : content,
    })
    //now informing the user about its post
    user.posts.push(post._id);
    await user.save();
    res.redirect('/profile');

})


app.listen(3000);