const mongoose = require("mongoose");

const admin = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: false,
  },
  email_address: {
    type: String,
    required: true,
    unique: true,
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
    type: [String],
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
  phone_number: {
    type: String,
    required: true,
  },
  whatsapp_number: {
    type: String,
    required: true,
  },
  facebook: {
    type: String,
    required: true,
  },
  instagram: {
    type: String,
    required: true,
  },
  github: {
    type: String,
    required: true,
  },
  code_wars: {
    type: String,
    required: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  joind_at: {
    type: String,
    required: true,
  },
});

const Admin = mongoose.model("admin", admin);

module.exports = Admin;
