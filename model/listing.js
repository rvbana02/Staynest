const mongoose = require("mongoose");
const Review = require("./review");
const schema = mongoose.Schema;

const listingSchema = new schema({
  title: {
    type: String,
    required: true,
  },
  description: String,

  images: [
    {
      url: String,
      filename: String
    }
  ],

  price: Number,
  location: String,
  country: String,
  mapsrc: String,

  reviews: [
    {
      type: schema.Types.ObjectId,
      ref: "Review",
    },
  ],

  owner: {
    type: schema.Types.ObjectId,
    ref: "User",
  }
});

// Delete all reviews when listing is deleted
listingSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({ _id: { $in: doc.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
