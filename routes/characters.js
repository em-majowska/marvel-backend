const express = require("express");
const router = express.Router();
const axios = require("axios");

// get all characters
router.get("/characters", async (req, res) => {
  try {
    const data = await axios.get(
      `${process.env.BASE_API_URL}/characters?apiKey=${process.env.API_KEY}`,
    );

    const characters = data.data;
    res.status(200).json({ characters });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server error" });
  }
});

// get a character by id
router.get("/character/:id", async (req, res) => {
  try {
    const data = await axios.get(
      `${process.env.BASE_API_URL}/character/${req.params.id}?apiKey=${process.env.API_KEY}`,
    );

    const character = data.data;
    res.status(200).json({ character });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server error" });
  }
});

module.exports = router;
