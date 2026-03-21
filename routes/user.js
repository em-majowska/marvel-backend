const express = require("express");
const router = express.Router();
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const fileUpload = require("express-fileupload");
const convertToBase64 = require("../utils/convertToBase64");
const cloudinary = require("cloudinary").v2;
const isAuthenticated = require("../middlewares/isAuthenticated");
const User = require("../models/User");

// POST create new user
router.post("/user/signup", fileUpload(), async (req, res) => {
  try {
    const data = req.body;
    console.log(data);

    // check all parameters
    if (!data.email || !data.username || !data.password) {
      throw {
        status: 400,
        message: "Email address, username and password are mandatory",
      };
    }

    // Check if email was already used for registration
    if (await User.findOne({ email: data.email }))
      throw { status: 409, message: "This email is already used" };

    // Check if username was already used for registration
    if (await User.findOne({ username: data.username })) {
      throw { status: 409, message: "The username is already taken" };
    }

    // Encrypt password
    const salt = uid2(16);
    const hash = SHA256(data.password + salt).toString(encBase64);
    const token = uid2(64);

    // Upload picture
    let picture;
    if (req.files) {
      picture = await cloudinary.uploader.upload(
        convertToBase64(req.files.picture),
        { folder: "/marvel/avatars" },
      );
    }
    const newUser = new User({
      account: {
        username: data.username,
        avatar: picture || {},
      },
      email: data.email,
      favourites: data.favourites || [],
      salt: salt,
      hash: hash,
      token: token,
    });

    newUser.save();

    res.status(201).json({
      _id: newUser._id,
      token: newUser.token,
      account: newUser.account,
    });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server error" });
  }
});

// POST Login
router.post("/user/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    // Check if user of given email exists
    if (!user) {
      throw res.status(401).json({
        message:
          "We couldn't find this email in our database. Sign up to save your favourite heroes and comics!",
      });
    }

    // Check if passwords match
    const newHash = SHA256(req.body.password + user.salt).toString(encBase64);
    if (newHash !== user.hash) {
      throw res.status(401).json({ message: "Unauthorized" });
    }

    res
      .status(200)
      .json({ _id: user._id, token: user.token, account: user.account });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server error" });
  }
});

// GET user's favourites

router.get("/user/favourites", isAuthenticated, async (req, res) => {
  try {
    const favourites = req.user.favourites;

    res.status(200).json({ favourites });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server error" });
  }
});

// PUT save new favourites
router.put("/user/modify", isAuthenticated, async (req, res) => {
  try {
    // find user
    const user = await User.findById(req.user._id);
    if (!user) throw res.status(400).json({ message: "User not found" });

    // update array of favourites
    const newFavourite = req.body.favourites;
    const itemInFavourites = user.favourites.find(
      (el) => el._id === newFavourite._id,
    );

    if (!itemInFavourites) {
      user.favourites = [...user.favourites, newFavourite];
    } else {
      user.favourites = user.favourites.filter(
        (obj) => obj._id !== newFavourite._id,
      );
    }
    await user.save();

    res.status(200).json({ message: "User updated", user: user });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server error" });
  }
});

module.exports = router;
