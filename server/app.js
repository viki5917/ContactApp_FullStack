//npm i express mongoose cors morgan dotenv
//npm i -D nodemon
//npm i jsonwebtoken
//npm i bcrypt
//npm i joi

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const connectDB = require("./config/db");
require("dotenv").config({ path: "./config/config.env" });
const validateToken = require("./middleware/validateToken");

const app = express();

//middleware
app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());

//routes
app.use("/api", require("./routes/auth"));
app.use("/api", require("./routes/contactRoute"));

//server configurations
const PORT = process.env.PORT || 8000;
app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    console.log(error);
  }
});
