const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const Campground = require("./models/campground");
const ExpressError = require("./utils/expressError")

//connecting to db
mongoose
  .connect("mongodb://localhost:27017/camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    //useCreateIndex: true,
  })
  //catch initial errors while connecting initially
  .then(() => console.log("initially connected to db"))
  .catch(() => console.log("error connecting to db"));
//catch errors in connection after initial connection
let db = mongoose.connection;
db.on("error", () => console.log("error in db connection"));
db.once("open", () => console.log("db connection open"));

const app = express();

//view engine settings
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

//ROUTES---------------------------------------------------------------------------------------
//show home
app.get("/", (req, res) => {
  res.render("home");
});
//show campgrounds index
app.get("/campgrounds", async (req, res) => {
  try {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  } catch (err) {
    next(err);
  }
});
//show add new campground form
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});
//show individual campgrounds
app.get("/campgrounds/:id", async (req, res, next) => {
  try {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/show", { campground });
  } catch (err) {
    next(err);
  }
});
//add new campground data (coming from add form)to db
app.post("/campgrounds", async (req, res) => {
  try {
    const campground = new Campground(req.body.campground); // because the form is made such that the req.body = {campground: {title: ..., location: ...} }
    const camp = await campground.save();
    res.redirect(`/campgrounds/${camp._id}`);
  } catch (err) {
    next(err);
  }
});
//show the edit campground form
app.get("/campgrounds/:id/edit", async (req, res) => {
  try {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
  } catch (err) {
    next(err);
  }
});
//update the edited campground data(from edit form) to db
app.put("/campgrounds/:id", async (req, res) => {
  try {
    await Campground.findByIdAndUpdate(req.params.id, req.body.campground); //// because the form is made such that the req.body = {campground: {title: ..., location: ...} }
    res.redirect(`/campgrounds/${req.params.id}`);
  } catch (err) {
    next(err);
  }
});
//delete a campground
app.delete("/campgrounds/:id", async (req, res) => {
  try {
    await Campground.findByIdAndDelete(req.params.id);
    res.redirect("/campgrounds");
  } catch (err) {
    next(err);
  }
});

app.all('*',(req,res,next)=>{
  let error = new ExpressError("Page not found", 404)
  next(error)
})
//error handling function
app.use((err, req, res, next) => {
  const { message = 'something went wrong', statusCode = 500 } = err;
  res.status(statusCode).send(message);
});

//start server
app.listen(process.env.PORT || 3000, () => console.log("server running"));
