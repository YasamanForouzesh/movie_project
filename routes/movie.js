const express=require('express')
const movie=require('../controlers/movie/movie.js')
const router=express.Router()
//const db = require('./models')
router.get('/',movie.findAllMovies)
router.get('/:imdb',movie.findMoviesById)
router.post('/fave/:imdb/:title/:Rated',movie.addFaveToTable)
// delete the movie for this user
router.delete('/delete/:id',movie.deleteMovie)
// to add the comment to the movie
router.post('/comment/:id',movie.addComment)
module.exports=router