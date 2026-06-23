const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "../.env" }); // IMPORTANT

console.log("MONGO_URL =", process.env.MONGO_URL);

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("Connected"))
  .catch(err => console.log(err));