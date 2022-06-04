const express = require("express");
const Campground = require("../models/campground");
const Review = require("../models/review");
const ExpressError = require("../utils/expressError");

const router = express.Router({mergeParams:true});// mergeparams will make the :id param(which is in the app.js file) available inside this route file


//save a review to db
router.post('/',async (req,res, next)=>{
    try {
      const campground = await Campground.findById(req.params.id)
      const review = new Review(req.body.review)
      campground.reviews.push(review);
      await review.save();
      await campground.save();
      req.flash('success', 'added review')
      res.redirect(`/campgrounds/${req.params.id}`)
    } catch (error) {
      next(error)
    }
  })
  //delete a review
  router.delete('/:reviewId', async (req,res, next)=>{
    try {
      const {id, reviewId} = req.params
      await Campground.findByIdAndUpdate(id,{$pull:{reviews: reviewId}})
      await Review.findByIdAndDelete(req.params.reviewId)
      req.flash('success','deleted review')
      res.redirect(`/campgrounds/${id}`)
    } catch (error) {
      next(error)
    }
  })

  module.exports = router;