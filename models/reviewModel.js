const mongoose = require("mongoose");
const Tour = require("./tourModel.js");
const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review cannot be empty!"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "Review must belong to a tour."],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must have an author!"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name photo",
  });
  // .populate({
  // //   path: "tour",
  // //   select: "name",
  // // });
  next();
});
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: "$tour",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};
reviewSchema.post("save", function () {
  //this points to current review.
  // Review.calcAverageRatings(this.tour); == cant work coz Review is not yet defined. if we place this under Review declaration the schema wont have the presave middleware. so...
  //this.constructor also means the Model. so this works..
  this.constructor.calcAverageRatings(this.tour);
});
reviewSchema.pre(/^findOneAnd/, async function (next) {
  //this is the current query-- so we execute a query and get the document on 'this'
  this.r = await this.findOne();

  next();
});
reviewSchema.post(/^findOneAnd/, async function () {
  //await this.findOne();-- this doesnt work here because the query has already been executed
  await this.r.constructor.calcAverageRatings(this.r.tour);
});
const Review = new mongoose.model("Review", reviewSchema);
module.exports = Review;
