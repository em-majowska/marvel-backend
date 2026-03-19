require("dotenv").config();
const cors = require("cors");
const express = require("express");
// const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use(cors());

// mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/marvel");
const comicsRoutes = require("./routes/comics");
const charactersRoutes = require("./routes/characters");

app.get("/", async (req, res) => {
  try {
    res.status(200).json({ message: "Welcome to the Marvel Server 🐨" });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server error" });
  }
});

app.use(comicsRoutes);
app.use(charactersRoutes);

app.all(/.*/, (req, res) => {
  res.status(404).json({ message: "Page not found" });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server has started!");
});
