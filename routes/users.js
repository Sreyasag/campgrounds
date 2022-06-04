const express = require("express");
const User= require('../models/user')
const router= express.Router();
//render the regiser form
router.get('/register',(req,res)=>{
    res.render('users/register')
})

//save a new account  registration
router.post('/register',(req,res)=>{
    
})

module.exports=router;