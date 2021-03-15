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

//--routes--
app.get("/api/v1/tours/:id", getTour);
app.patch("/api/v1/tours/:id", updateTour);
app.delete("/api/v1/tours/:id", deleteTour);

app.route("/api/v1/tours").get(getAllTours).post(createTour);
app
  .route("/api/v1/tours/:id")
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

//server---
const port = 3000;
app.listen(port, () => {
  console.log(`server is up on ${port}!`);
});
