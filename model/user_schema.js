const mongoose = require('mongoose');

const Comment = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  password: { type: String },
  status: { type: Number, default: 0 },
  otp: { type: Number, default: 0 },
  otp_status: { type: Number, default: 0 }
});

// login status: 1
// logout status : 0

const user_schema = mongoose.model("Register_user", Comment);
module.exports = user_schema;  