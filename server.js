require('dotenv').config()
const express=require('express')
const app=express()
const layouts=require('express-ejs-layouts')
const axios=require('axios')
const methodOverride=require('method-override')
app.use(express.static(__dirname + '/public'))
const session = require('express-session')
const passport = require('./config/ppConfig.js')
const flash = require('connect-flash')
const db=require('./models')
// define view engine. view engine help us to render the page. Ejs helps user to use html and java script
app.set('view engine','ejs')
// layout midle ware
app.use(layouts)
// session midleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}))
// passport midleware 
app.use(passport.initialize())
app.use(passport.session())
// flash middleware
app.use(flash())

// CUSTOM MIDDLEWARE
app.use((req, res, next)=>{
    // before every route, attach teh flash messages and current user to res.locals
    res.locals.alerts = req.flash()
    res.locals.currentUser = req.user
    next() // move on to the next piece of middleware
})
// midelware to pars body
app.use(express.urlencoded({extended:false}))
// method override midleware
app.use(methodOverride('_method'))
// routes midle ware
app.use('/movies',require('./routes/movie.js'))
app.use('/profile',require('./routes/profile.js'))
// Get Home route
app.get('/',(req,res)=>{
    // db.user.findAll().then(info=>{
    //     console.log("😒")
    //     console.log(info)
    //     info.forEach(user=>{

    //        user.getMovies().then(movie=>{
    //             console.log("😁")
    //             console.log(movie)
    //     })
    //     })
    // })
    res.render('home.ejs')
})
app.listen(process.env.PORT,()=>{
    console.log(`👌I'm listening to ${process.env.PORT}`)
})
