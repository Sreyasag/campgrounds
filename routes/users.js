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
        registeredUser = await User.register(user,password)
        req.login(registeredUser,(err)=>{
            if(err){next(err)};
            req.flash('success','Account created');
            res.redirect ('/campgrounds');
        })
        
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
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})
//logout
router.get('/logout',(req,res,next) => {
    
    req.logout((err)=> {
        if(err){next(err)}
        req.flash('success','Logged out')
        res.redirect('/campgrounds')
    })
    
})

module.exports=router;