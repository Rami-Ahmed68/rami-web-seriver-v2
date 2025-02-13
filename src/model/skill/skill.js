const mongoose = require("mongoose");

const skill = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  created_at: {
    type: String,
    required: true,
  },
});

const Skill = mongoose.model("skill", skill);

module.exports = Skill;
