const mongoose = require('mongoose');

const Comment = new mongoose.Schema({
    name: { type: String },
    email: { type: String },
    password: { type: String },
    status: { type: Number, default: 0 }
  });

// login status: 1
// logout status : 0

const admin_schema = mongoose.model("register_admin", Comment);
module.exports = admin_schema;
