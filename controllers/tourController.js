const Tour = require("../models/tourModel.js");
const APIFeatures = require("./../utils/apiFeatures.js");
//--route handlers--
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    //--Execute Query
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;
    res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
  // console.log(req.query);
  //get query as a new object
  //1A-- Filtering
  // const queryObj = { ...req.query };
  // //Field exclusion
  // const excludedFields = ["page", "sort", "limit", "fields"];
  // excludedFields.forEach((field) => delete queryObj[field]);

  // // {difficulty: 'easy', duration: {$gte : 5}}
  // //{ difficulty: { gte: 'easy' } }
  // //--mongoose accepts JSON-
  // let queryString = JSON.stringify(queryObj);
  // queryString = queryString.replace(
  //   /\b(gte|gt|lte|lt)\b/g,
  //   (match) => `$${match}`
  // );
  // // console.log(JSON.parse(queryString));
  // //1B--find data based on query. find returns a promise. that we will await after implementing sort, pagination, projection fields.
  // let query = Tour.find(JSON.parse(queryString));
  // //2--Sort
  // if (req.query.sort) {
  //   const sortBy = req.query.sort.split(",").join(" ");
  //   console.log(sortBy);
  //   query = query.sort(sortBy);
  // } else {
  //   query.sort("-createdAt");
  // }
  // //3--Field Limiting--
  // if (req.query.fields) {
  //   const fields = req.query.fields.split(",").join(" ");
  //   query = query.select(fields);
  // } else {
  //   query.select("-__v");
  // }
  // //4--Pagination--
  // const page = +req.query.page || 1;
  // const limit = +req.query.limit || 100;
  // const skip = (page - 1) * limit;
  // query = query.skip(skip).limit(limit);
  // const numberTour = await Tour.countDocuments();
  // if (req.query.page) {
  //   if (skip >= numberTour) throw new Error("This page doesnt exist!");
  // }
};
exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    //Tours.findOne({_id: req.params.id})
    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: "Could not find tour",
    });
  }
};
exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Invalid data set",
    });
  }
};
exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Invalid data set",
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Invalid data set",
    });
  }
};
