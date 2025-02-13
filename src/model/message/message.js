const mongoose = require("mongoose");

const message = new mongoose.Schema({
  full_name: {
    type: String,
    required: true,
  },
  email_address: {
    type: String,
    required: true,
  },
  phone_number: {
    type: String,
    required: true,
  },
  whatsapp_number: {
    type: String,
    required: true,
  },
  custom_message: {
    type: String,
    required: true,
  },
  created_at: {
    type: String,
    required: true,
  },
});
