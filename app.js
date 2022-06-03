const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/expressError");
const campgroundRoute = require("./routes/campgrounds");
const reviewRoute = require("./routes/reviews");

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

app.use("/campgrounds", campgroundRoute);
app.use("/campgrounds/:id/reviews", reviewRoute);

//generating a 404 error
app.all("*", (req, res, next) => {
  let error = new ExpressError("Page not found", 404);
  next(error);
});
//error handling function
app.use((err, req, res, next) => {
  const { message = "something went wrong", statusCode = 500 } = err;
  res.status(statusCode).render("error", { message, statusCode });
  console.log(err)
});

//start server
app.listen(process.env.PORT || 3000, () => console.log("server running"));
