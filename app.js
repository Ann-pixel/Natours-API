const fs = require("fs");
const express = require("express");
const morgan = require("morgan");
const e = require("express");
const app = express();

//--middlewares--
app.use(morgan("tiny"));
app.use(express.json());
app.use((req, res, next) => {
  console.log("hello from the middleware!");
  next();
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//--reading data--
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

//--route handlers--
function getAllTours(req, res) {
  // console.log(req.requestTime);
  res.status(200).json({
    requestedAt: req.requestTime,
    status: "success",
    results: tours.length,
    data: {
      tours,
    },
  });
}
function getTour(req, res) {
  if (+req.params.id > tours.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }
  const tour = tours.find((ele) => ele.id === +req.params.id);
  console.log(tour);
  res.status(200).json({
    status: "success",

    data: {
      tour,
    },
  });
}
function createTour(req, res) {
  //   console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: "success",
        data: {
          tour: newTour,
        },
      });
    }
  );
}
function updateTour(req, res) {
  if (+req.params.id > tours.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }
  res.status(200).json({
    status: "success",
    data: {
      tour: "*UPDATED TOUR!*",
    },
  });
}
function deleteTour(req, res) {
  if (+req.params.id > tours.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
}
function getAllUsers(req, res) {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
}
function createUser(req, res) {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
}
function getUser(req, res) {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
}
function updateUser(req, res) {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
}
function deleteUser(req, res) {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
}
//--routes--
const tourRouter = express.Router();
const userRouter = express.Router();
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
//tours--
tourRouter.route("/").get(getAllTours).post(createTour);
tourRouter.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);
//users--
userRouter.route("/").get(getAllUsers).post(createUser);
userRouter.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);
//server---
const port = 3000;
app.listen(port, () => {
  console.log(`server is up on ${port}!`);
});
