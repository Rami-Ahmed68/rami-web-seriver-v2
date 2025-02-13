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
  },
  video: {
    type: String,
    required: false,
  },
  images: [
    {
      type: String,
      required: false,
    },
  ],
  web_site_link: {
    type: String,
    required: true,
  },
  android_link: {
    type: String,
    required: true,
  },
  ios_link: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["Work", "Collaborations"],
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
  created_at: {
    type: String,
    required: true,
  },
});

const Work = mongoose.model("work", work);
module.exports = Work;
