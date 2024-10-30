const express = require('express')
const path = require('path')
const userRoute = require('./routes/user.js')

const blogRoute = require('./routes/blog.js')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const {checkForAuthenticationCookie} = require('./middlewares/authentication.js')
const Blog = require('./models/blog.js')
const app = express()
const PORT = 3000;

mongoose.connect("mongodb://localhost:27017/Blogify").then(()=>{
    console.log('MongoDb Connected!')
})

app.set('view engine', 'ejs')
app.set("views", path.resolve("./views"))
app.use(express.urlencoded({extended:false}))
app.use(express.static(path.resolve('./public')))
app.use(cookieParser())
app.use(checkForAuthenticationCookie('token'))



app.get('/',async(req,res)=>{
    const allBlogs = await Blog.find({})
    res.render('home',{
        user:req.user,
        blogs:allBlogs,
    })
})

app.use('/user',userRoute)
app.use('/blog',blogRoute)


app.listen(PORT,()=>{
    console.log('Server Started at PORT : '+PORT)
})





