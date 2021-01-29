const axios=require('axios')
const moment=require('moment')
const db = require('../../models')
const comment = require('../../models/comment')
module.exports.findAllMovies=function(req,res){
    axios.get(`http://www.omdbapi.com/?apikey=${process.env.API_KEY}&s=${req.query.SearchText}`)
    .then(response=>{
        res.render('movie/movies.ejs',{data:response.data.Search})
        //res.send(response.data.Search)
        console.log("👀inside the movies")
    })
}

module.exports.findMoviesById=(req,res)=>{

    if(req.user){
       // res.send(`req.user: ${req.user.name}`)
        axios.get(`http://www.omdbapi.com/?apikey=${process.env.API_KEY}&i=${req.params.imdb}`)
    .then(response=>{
        //res.send(response.data)
        res.render('movie/movie_details.ejs',{data:response.data})
    })
    } else {
        res.redirect('/profile/login')
    }
    
}

module.exports.addFaveToTable=(req,res)=>{
    var a = moment();
    var b = moment(req.user.dob, 'YYYY');  
    var diff = a.diff(b, 'years');
    let rated=req.params.Rated
    if(diff<18){
        if(rated.includes('R')||rated.includes('X')){
            req.flash('error','sorry this mvoie is not good for your age')
            res.redirect(`/movies/${req.params.imdb}`)
        }
    }
   //console.log(`💖 this is the tutle: ${req.params.title} , this is the url : ${req.body.url}`)
    db.movie.findOrCreate({
        where:{
            imdb:req.params.imdb
        },
        defaults:{
            title:req.params.title,
            url:req.body.url
        }
    }).then(([movie,wasCreated])=>{
        movie.addUser(req.user)
        req.flash('success',`${movie.title} was added to your favorite list`)
        res.redirect(`/movies/${movie.imdb}`)
    })
    
   
}
module.exports.deleteMovie=(req,res)=>{
    
    db.user.findOne({
        where:{
            email:req.user.email
        },  

    }).then(user=>{
        db.movie.findByPk(req.params.id)
        .then(movie=>{
            user.removeMovie(movie)
            res.redirect('/profile/myFave')
        })
    })
}
module.exports.addComment=(req,res)=>{
    db.user.findOne({
        where:{
            email:req.user.email
        }
    }).then(user=>{
        db.movie.findByPk(req.params.id).then(movie=>{
            db.comment.create({
                userId:user.id,
                movieId:movie.id,
                comment:req.body.comment
            }).then(comment=>{
                console.log("🎂")
                console.log(comment)
                res.redirect('/profile')
            })
        })
       

    })
}