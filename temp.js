const express = require("express");

const router = express.Router();
router.use(some function these apllies to all routes in this file only)
router.get('/',(req,res)=>{...})
router.post('/',(req,res)=>{...})
router.get('/something',(req,res)=>{...})


/////////////////////////////

const expRoute = require("./router/shelter")
app.use{here it will trigger for all routes}
app.use('/mainpage', expRoute)