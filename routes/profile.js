const express=require('express')
const router=express.Router()
const profile=require('../controlers/profile/profile.js')
const passport = require('../config/ppConfig.js')
const isLoggedIn = require('../midelware/isLoggedIn')
// Get CRUD to show the profile 
router.get('/',isLoggedIn,profile.showProfile)
// Get CRUD function to show the signup page
router.get('/signup',profile.showSignup)
// post to sign up the user 
router.post('/signup',profile.signup)
// Get function to let user log in
router.get('/login',profile.showLogin)

router.post('/login',profile.loginAuth)
// Get to show the delete page
router.get('/delete',profile.showDelete)
// Delete function to delete the account
router.delete('/delete',profile.delete)
// The log out route
router.get('logout',profile.logout)
// The update profile GET function
router.get('/update',isLoggedIn,profile.showUpdate)
// The update profile PUT function
router.put('/update',isLoggedIn,profile.update)
// The logout Path GET
router.get('/logout',profile.logout)
// The route show the faves
router.get('/myFave',isLoggedIn,profile.showFaves)
module.exports=router