const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");

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

const randomElement = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

const addSeedData = async function () {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const x = randomElement(cities);
    const camp = new Campground({
      title: `${randomElement(descriptors)} ${randomElement(places)}`,
      location: `${x.city}, ${x.state}`,
      image: 'https://source.unsplash.com/collection/483251',
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate nemo est quidem cumque nesciunt praesentium numquam quod vel eaque nobis, maiores sunt necessitatibus ratione itaque dolore obcaecati facere reiciendis natus!",
      price: (Math.floor(Math.random()* 200))+10,
      
    });
    await camp.save();
  }
};

addSeedData().then(() => {
  mongoose.connection.close();
});
