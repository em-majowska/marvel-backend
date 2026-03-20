const express = require("express");
const router = express.Router();
const axios = require("axios");

// get all comics (limit, skip 100)
router.get("/comics", async (req, res) => {
  try {
    // limit for dropdown (quantity per page)
    let limit = req.query.limit || 100;
    let page = (req.query.page - 1) * limit || 0;

    let queries = "";
    console.log(req.query.title);

    if (req.query.title) queries += "&title=" + req.query.title;
    if (req.query.limit) queries += "&limit=" + limit;
    if (req.query.page) queries += "&skip=" + page;

    const response = await axios.get(
      `${process.env.MARVEL_API_URL}/comics?apiKey=${process.env.API_KEY}${queries}`,
    );

    res.status(200).json(response.data);
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
      `${process.env.MARVEL_API_URL}/comic/${req.params.id}?apiKey=${process.env.API_KEY}`,
    );

    res.status(200).json(response.data);
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
      `${process.env.MARVEL_API_URL}/comics/${req.params.id}?apiKey=${process.env.API_KEY}`,
    );

    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server error" });
  }
});

module.exports = router;
