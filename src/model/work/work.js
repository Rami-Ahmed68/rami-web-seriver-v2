const mongoose = require("mongoose");

const work = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  cover: {
    type: String,
    required: false,
    default: "",
  },
  video: {
    type: String,
    required: false,
    default: "",
  },
  images: [
    {
      type: String,
      required: false,
    },
  ],
  web_site_link: {
    type: String,
    required: false,
  },
  android_link: {
    type: String,
    required: false,
  },
  ios_link: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    enum: ["Work", "Collaborations"],
    required: true,
  },
  front_end: [
    {
      type: String,
    },
  ],
  back_end: [
    {
      type: String,
    },
  ],
  views: {
    type: Number,
    default: 0,
  },
  created_at: {
    type: String,
    required: true,
  },
});

const Work = mongoose.model("work", work);
module.exports = Work;
