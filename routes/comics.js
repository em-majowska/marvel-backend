const express = require("express");
const router = express.Router();
const axios = require("axios");

// get all comics
router.get("/comics", async (req, res) => {
  try {
    const data = await axios.get(
      `${process.env.BASE_API_URL}/comics?apiKey=${process.env.API_KEY}`,
    );

    const comics = data.data;
    res.status(200).json({ comics });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server error" });
  }
});

// get comic by id
router.get("/comic/:id", async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.BASE_API_URL}/comic/${req.params.id}?apiKey=${process.env.API_KEY}`,
    );
    const comic = response.data;

    res.status(200).json({ comic });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server error" });
  }
});

// get comics by character's id
router.get("/comics/:id", async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.BASE_API_URL}/comics/${req.params.id}?apiKey=${process.env.API_KEY}`,
    );

    const comics = response.data;

    res.status(200).json({ comics });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server error" });
  }
});

module.exports = router;
