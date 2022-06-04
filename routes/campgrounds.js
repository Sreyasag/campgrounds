const express = require("express");
const Campground = require("../models/campground");
const ExpressError = require("../utils/expressError");
const { isLoggedin, isAuthor } = require('../middleware')

router = express.Router();




//show campgrounds index
router.get("/", async (req, res, next) => {
  try {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  } catch (err) {
    next(err);
  }
});
//show add new campground form
router.get("/new",isLoggedin, (req, res) => {
  res.render("campgrounds/new");
});
//show individual campgrounds
router.get("/:id",isLoggedin, async (req, res, next) => {
  try {
    const campground = await Campground.findById(req.params.id).populate(
      "reviews"
    );
    if(!campground){
      req.flash('error', 'campground not found');
      return res.redirect('/campgrounds')
    }
    res.render("campgrounds/show", { campground });
  } catch (err) {
    next(err);
  }
});
//add new campground data (coming from add form)to db
router.post("/",isLoggedin, async (req, res, next) => {
  try {
    if (!req.body.campground) {
      throw new ExpressError("invalid campground data", 400);
    }
    const campground = new Campground(req.body.campground); // because the form is made such that the req.body = {campground: {title: ..., location: ...} }
    campground.author = req.user;
    const camp = await campground.save();
    req.flash('success', 'created a new campground');
    res.redirect(`/campgrounds/${camp._id}`);
  } catch (err) {
    next(err);
  }
});
//show the edit campground form
router.get("/:id/edit",isLoggedin,isAuthor, async (req, res, next) => {
  try {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
  } catch (err) {
    next(err);
  }
});
//update the edited campground data(from edit form) to db
router.put("/:id",isLoggedin,isAuthor, async (req, res, next) => {
  try {
    await Campground.findByIdAndUpdate(req.params.id, req.body.campground); //// because the form is made such that the req.body = {campground: {title: ..., location: ...} }
    req.flash('success', 'updated the campground')
    res.redirect(`/campgrounds/${req.params.id}`);
  } catch (err) {
    next(err);
  }
});
//delete a campground
router.delete("/:id",isLoggedin,isAuthor, async (req, res, next) => {
  try {
    await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', 'deleted campground')
    res.redirect("/campgrounds");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
  