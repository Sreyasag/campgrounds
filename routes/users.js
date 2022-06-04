const express = require("express");
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
//log in logic
router.post('/login',(req,res)=>{
    
})

module.exports=router;