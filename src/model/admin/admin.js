const mongoose = require("mongoose");

const admin = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  email_address: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  work: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    required: true,
  },
  love: {
    type: String,
    required: true,
  },
  cv: {
    type: String,
    required: false,
  },
  joind_at: {
    type: String,
    required: true,
  },
});

const Admin = mongoose.model("admin", admin);

module.exports = Admin;
