const mongoose = require("mongoose");

const User = mongoose.model("User", {
  account: {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    avatar: Object,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  favourites: {
    type: [Object],
  },
  salt: String,
  hash: String,
  token: String,
});

module.exports = User;
