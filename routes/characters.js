const express = require("express");
const router = express.Router();
const axios = require("axios");

// GET all characters (name, limit, skip 100)
router.get("/characters", async (req, res) => {
  try {
    // limit for dropdown (quantity per page)
    let limit = req.query.limit || 100;
    let page = (req.query.page - 1) * limit || 0;

    let queries = "";

    if (req.query.name) queries += "&name=" + req.query.name;
    if (req.query.limit) queries += "&limit=" + limit;
    if (req.query.page) queries += "&skip=" + page;

    const response = await axios.get(
      `${process.env.MARVEL_API_URL}/characters?apiKey=${process.env.API_KEY}${queries}`,
    );

    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server error" });
  }
});

// GET a character by id
router.get("/character/:id", async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.MARVEL_API_URL}/character/${req.params.id}?apiKey=${process.env.API_KEY}`,
    );

    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server error" });
  }
});

module.exports = router;
