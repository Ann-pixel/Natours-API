//server---
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app.js");

const db = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((conn) => {
    // console.log(conn.connections);
    console.log("db connection established!");
  });
// console.log(app.get("env"));
// console.log(process.env.NODE_ENV);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`server is up on ${port}!`);
});
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 🎃");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 🎃");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

//TEST!
