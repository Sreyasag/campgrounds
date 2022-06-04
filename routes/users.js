const express = require("express");
const passport = require("passport");

const User= require('../models/user')
const router= express.Router();
//render the regiser form
router.get('/register',(req,res)=>{
    res.render('users/register')
})

//save a new account  registration
router.post('/register',async (req,res)=>{
    try {
        const {username, email, password} = req.body;
        const user = new User({username, email});
        await User.register(user,password)
        req.flash('success','Account created')
        res.redirect ('/campgrounds')
    } catch (error) {
        req.flash('error',error.message);
        res.redirect('/register');
    }
})
//render the login form
router.get('/login',(req,res)=>{
    res.render('users/login')
})
//login logic
router.post('/login', passport.authenticate('local',{failureFlash:true, failureRedirect:'/login'}), (req,res)=>{
    req.flash('success','Welcome back!');
    res.redirect('/campgrounds')
})

module.exports=router;