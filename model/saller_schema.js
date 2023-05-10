const mongoose = require('mongoose');

const Comment = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  password: { type: String },
  saller_pancard: { type: String },
  saller_bank_acc_no: { type: String },
  admin_permission_status: { type: String, default: "granted" },
  total_add_product: { type: Number },
  status: { type: Number, default: 0 },
  otp: { type: Number, default: 0 },
  otp_status: { type: Number, default: 0 }
});

// login status: 1
// logout status : 0

const register_saller_schema = mongoose.model("Register_Saller", Comment);
module.exports = register_saller_schema;

 