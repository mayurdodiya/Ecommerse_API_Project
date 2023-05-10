var admin_schema = require("../model/admin_schema");
const Permission_pending_schema = require("../model/Permission_pending_schema");
const register_saller_schema = require("../model/saller_schema");
const product_schema = require("../model/product_schema");

// globle vaible declair --------------------------------------------------------
var globle_login_admin = "global admin varible is blank" /* --> jya sudhi app crash nhi thay thya sudhi global var ma data store rhe che */


// Add admin --------------------------------------------------------------------
var add_admin = async (req, res) => {

  var data = await admin_schema.create(req.body);

  res.status(200).json({
    status: "Success",
    data
  })
}


// Login ------------------------------------------------------------------------
var login = async (req, res) => {

  var data = await admin_schema.find({ email: req.body.email });

  // asign data in globle varible for logout process
  globle_login_admin = data;

  if (data == 0) {
    console.log("data is : 0");

    res.status(200).json({
      status: "invalid email"
    })
  } else if (data[0].password == req.body.password) {

    if (data[0].status == 1) {
      res.status(200).json({
        status: "Your acc. is  already login in other device logout first.."
      })
    } else {
      var login_status = await admin_schema.findByIdAndUpdate(data[0]._id, { status: 1 });
      res.status(200).json({
        status: "Login Success..",
        data
      })
    }
  } else {
    res.status(200).json({
      status: "invalid password.."
    })
  }

}


// Logout admin -----------------------------------------------------------------
var logout_admin = async (req, res) => {

  var login_admin_id = globle_login_admin[0]._id;

  var data = await admin_schema.findByIdAndUpdate(login_admin_id, { status: 0 });
  res.status(200).json({
    status: "Logout Success..",
  })
}


// permision pending of saller --------------------------------------------------
var permision_pending = async (req, res) => {
  var data = await Permission_pending_schema.find();

  res.status(200).json({
    status: "Success",
    data
  })
}


// permission granted -----------------------------------------------------------
var permission_granted = async (req, res) => {
  var data = await Permission_pending_schema.find({ _id: req.params.user_id });
  console.log(data);

  var obj = {
    name: data[0].name,
    email: data[0].email,
    password: data[0].password,
    saller_pancard: data[0].saller_pancard,
    saller_bank_acc_no: data[0].saller_bank_acc_no,
    admin_permission_status: "granted",
    total_add_product: data[0].total_add_product

  }
  var data1 = await register_saller_schema.create(obj)

  var data2 = await Permission_pending_schema.findByIdAndDelete({ _id: req.params.user_id });

  res.status(200).json({
    status: "Success",
    data1
  })
}


// View all active saller -------------------------------------------------------
var view_all_active_saller = async (req, res) => {
  var data = await register_saller_schema.find();

  res.status(200).json({
    status: "Success",
    data
  })
}


// Find saller by name ----------------------------------------------------------
var find_saller_by_name = async (req, res) => {
  var data = await register_saller_schema.find({ name: { $regex: req.params.name } });

  res.status(200).json({
    status: "Success",
    data
  })
}


// View perticular saller's product ---------------------------------------------
var view_perticular_saller_product = async (req, res) => {
  var data = await product_schema.find({ user_id: req.params.user_id });

  res.status(200).json({
    status: "SUccess",
    data
  })
}


// block saller -----------------------------------------------------------------
var block_saller = async (req, res) => {
  var data = await register_saller_schema.findByIdAndUpdate({ _id: req.body.id }, { admin_permission_status: "block" });

  res.status(200).json({
    status:"saller is succesfully block.",
    data
  })
}


// unblock saller ---------------------------------------------------------------
var unblock_saller = async (req, res) => {
  var data = await register_saller_schema.findByIdAndUpdate({ _id: req.body.id }, { admin_permission_status: "granted" });

  res.status(200).json({
    status:"saller is succesfully Unblock.",
    data
  })
}


//  all function are exports in --> routes/admin.js 
module.exports = {
  add_admin,
  login,
  logout_admin,
  permision_pending,
  permission_granted,
  view_all_active_saller,
  find_saller_by_name,
  view_perticular_saller_product,
  block_saller,
  unblock_saller
}