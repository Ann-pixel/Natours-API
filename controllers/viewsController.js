const Tour = require("./../models/tourModel.js");
const catchAsync = require("./../utils/catchAsync.js");
exports.getOverview = catchAsync(async (req, res, next) => {
  //get tour data from collection
  const tours = await Tour.find();
  //build template

  //render that template using data.
  res.status(200).render("overview", {
    title: "All tours",
    tours,
  });
});
exports.getTour = (req, res) => {
  res.status(200).render("tour", {
    title: "The Forest Hiker",
  });
};
