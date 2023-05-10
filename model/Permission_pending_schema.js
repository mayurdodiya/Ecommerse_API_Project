// saller acc permission pending from admin side

const mongoose = require('mongoose');

const Comment = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  password: { type: String },
  saller_pancard: { type: String },
  saller_bank_acc_no: { type: String },
  admin_permission_status: { type: String, default: "pending" },
  total_add_product: { type: Number }
});

const Permission_pending_schema = mongoose.model("Permission_pending", Comment);
module.exports = Permission_pending_schema;

