const db = require("../../models")
const passport=require('../../config/ppConfig.js')
const moment=require('moment')
module.exports.showSignup=(req,res)=>{
    let message=req.flash('error')
    res.render('profile/signup.ejs',{message:message})
}
module.exports.signup=(req,res)=>{
    // Create the user row in the database

    db.user.findOrCreate({
        where:{
            email:req.body.email
        },
        defaults:{
            fullname:req.body.fullname,
            username:req.body.username,
            password:req.body.password,
            dob:req.body.dob
        }
    }).then(([user,wasCreated])=>{

        if(wasCreated){
            //console.log(`just created the following user:`, createdUser)
            // res.send('POST form data from signup.ejs, then redirect')
            passport.authenticate('local', {
                successRedirect: '/profile',
            })(req, res) // IIFE
        } else {
            console.log('An account associated with that email address already exists! Did you mean to login?')
            res.redirect('/profile/login')
        }
    }) .catch(err =>{ // !-> FLASH <-!
        req.flash('error', err.message) 

        res.redirect('/profile/signup')
    })
}
module.exports.showProfile=(req,res)=>{
    if(!req.user){
        res.redirect('/profile/login')
    }
    // find the user to show their username and description and movie fave and comment
    var a = moment();
    var b = moment(req.user.dob, 'YYYY');  
    var diff = a.diff(b, 'years');
    let info=[]
    let addComment=""
    //console.log(req.user)

    req.user.getMovies()
    .then(movies=>{
        res.render('profile/profile.ejs',{age:diff,movies:movies,info})

        // if(movies.length>0){

        //     console.log(movies)
        //      movies.forEach(movie=>{
        //         movie.getComments()
        //         .then(comments=>{            
        //             comments.forEach(com=>{
        //                 info.push({
        //                     movieId:com.movieId,
        //                     comment:com.comment
        //                 })
        //             })
        //             console.log("💕")
        //             console.log(info)
                    
        //             res.render('profile/profile.ejs',{age:diff,movies:movies,info})
        //         })
        //     })
            
        // }else{

        //     res.render('profile/profile.ejs',{age:diff,movies:movies,info})
        // }

    })
    
}
module.exports.showLogin=(req,res)=>{
    res.render('profile/login.ejs')
}
module.exports.showDelete=(req,res)=>{

    res.render('profile/delete.ejs')
}

module.exports.delete=(req,res,next)=>{
    passport.authenticate('local',function(err, user, info) {
        if(err=="undifiend"){
            req.flash('error','Sorry we didn not find your eamil!')
            return res.redirect('/profile/delete')}
        if(err=="wrong Pass"){
            req.flash('error','your password is wrong please try again')
            return res.redirect('/profile/delete')
        }
        req.logIn(user, function(err) {
          if (err) { return next(err); }
          db.user.findOne({
            where:{
                email:req.body.email
            }
        }).then(user=>{
            user.removeMovie()
            user.destroy()
            res.redirect('/')
        })
          return res.redirect('/');
        });
      })(req, res, next);
 

}
module.exports.logout=(req,res)=>{
    req.logout()
    res.redirect('/')
}
module.exports.showUpdate=(req,res)=>{
    res.render('profile/update.ejs')
}
module.exports.update=(req,res)=>{
    let username
    if(req.user.username==req.body.username || req.body.username==""){
        username=req.user.username
    }else{
        username=req.body.username
    }
    db.user.update({
        description:req.body.description,
        username:username
    },
    {
            where:{
                email:req.user.email
            },
            returning: true,
            plain: true
        }
    ).then(user=>{
        res.redirect('/profile')
    })
}
module.exports.loginAuth=(req,res,next)=>{
    passport.authenticate('local',function(err, user, info) {
        if(err=="undifiend"){
            req.flash('error','Sorry we didn not find your eamil, please sign up!')
            return res.redirect('/profile/signup')}
        if(err=="wrong Pass"){
            req.flash('error','your password is wrong please try again')
            return res.redirect('/profile/login')
        }
        req.logIn(user, function(err) {
          if (err) { return next(err); }
          return res.redirect('/profile');
        });
      })(req, res, next);
}
module.exports.showFaves=(req,res)=>{
    db.user.findOne({
        where:{
            email:req.user.email
        }
    }).then(user=>{
        user.getMovies().then(movies=>{
            res.render('profile/fave.ejs',{movies})
        })
    })
  }
