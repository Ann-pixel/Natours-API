//server---

const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });
const app = require("./app.js");
// console.log(app.get("env"));
console.log(process.env.NODE_ENV);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`server is up on ${port}!`);
});
