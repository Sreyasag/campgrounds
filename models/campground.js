const mongoose = require("mongoose");
const Review = require("./review");

const Schema = mongoose.Schema;
campgroundSchema = new Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review'
    }
  ]
});

//mongoose  middleware which triggers if a campground object is deleted.
campgroundSchema.post('findOneAndDelete',async function(doc){ //we can use findoneaddelete for findbyidanddelete method (refer docs)
  if(doc){
    await Review.deleteMany({ _id : {$in : doc.reviews} })
  }
  
  //-----OR-----
  // for(let x of doc.reviews ){
  //   await Review.findByIdAndDelete(x)
  // }
})

module.exports = mongoose.model("Campground", campgroundSchema);
