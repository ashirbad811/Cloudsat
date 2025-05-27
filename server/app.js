const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./db");
const app = express();

app.get("/", (req, res) => {
  res.send("app is running");
});
require("dotenv").config();
// const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT;
connectDB();
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
