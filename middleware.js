const Campground = require('./models/campground')

module.exports.isLoggedin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl; 
    req.flash("error", "you must be signed in");
    return res.redirect("/login");
  }
  next();
};

//campground author verifying middleware
module.exports.isAuthor = async (req,res,next)=>{
  const{id}= req.params;
  const campgr = await Campground.findById(id);
  if(!req.user._id.equals(campgr.author)){
    req.flash('error','You do not have permission to do that')
    return res.redirect(`/campgrounds/${id}`)
  }
  next(); 
}
