var admin_schema = require("../model/admin_schema");
const Permission_pending_schema = require("../model/Permission_pending_schema");
const register_saller_schema = require("../model/saller_schema");
const product_schema = require("../model/product_schema");
var nodemailer = require('nodemailer');


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

// Forgote password (Sending email) -------------------------------------
var send_otp = async (req, res) => {
  console.log("Success login varible : ", globle_login_admin.length);

  // for password send in mail
  console.log("globle_user password : ", globle_login_admin[0].password);
  var user_id_copy = globle_login_admin[0]._id;
  var otp_r = Math.random() * 10000;
  var ceil_otp = Math.ceil(otp_r)
  console.log("math random number : ", ceil_otp);

  var otp_create = await admin_schema.findByIdAndUpdate({ _id: user_id_copy }, { otp: ceil_otp });

  console.log("otp create : ", otp_create);



  // Sending Email.
  var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: 'mayurdodiya1234@gmail.com',
          // pass: 'tavlnpikztikyrks'
          pass: 'yubhpbdhoqbtcbsg'
      }
  });

  var mailOptions = {
      from: 'mayurdodiya1234@gmail.com',
      to: 'mayurdodiya1234@gmail.com',
      // to: req.body.email,
      subject: 'Sending Email using Node.js',
      // text: 'Thank you for connecting with Us Mrs.Mira dodiya..! (auto generated email sent by your fionce..)'
      text: `Thank you for connecting with Us Mrs.Mira dodiya..! Your otp is : ${ceil_otp}.`
  };

  transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
          console.log(error);
      } else {
          console.log('Email sent: ' + info.response);
      }
  });


  // res.render('index', { title: 'Express' });
  res.status(200).json({
      status: "Success",
      msg: "mail sent.."
  });

}

// compair otp ----------------------------------------------------------
var compair_otp = async (req, res) => {

  
      var email_1 = globle_login_admin[0].email;
      console.log("otp = ", email_1);

      var data = await admin_schema.find({ email: email_1 });

      if (data[0].otp == req.body.otp) {
          // if (globle_login_admin[0].otp == req.body.otp) {
          var otp_status_change = await admin_schema.findByIdAndUpdate(data[0]._id, { otp_status: 11 });
          res.status(200).json({
              status: "email & otp is match.",
          });

      } else {
          res.status(200).json({
              status: "otp is not-match."
          })
      }

  

}

// resate password ------------------------------------------------------
var resate_password = async (req, res) => {

  // console.log("otpstatus",globle_login_admin);
  var otp_status = globle_login_admin[0].otp_status

  if (otp_status == 11) {
      var change_password = await admin_schema.findByIdAndUpdate(globle_login_admin[0]._id, { password: req.body.password });
      res.status(200).json({
          status: "Success"
      })
      var delete_otp = await admin_schema.findByIdAndUpdate(globle_login_admin[0]._id, { otp_status: 00 });
  } else {
      res.status(200).json({
          status: "otp is not-match."
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
  send_otp,
  compair_otp,
  resate_password,
  logout_admin,
  permision_pending,
  permission_granted,
  view_all_active_saller,
  find_saller_by_name,
  view_perticular_saller_product,
  block_saller,
  unblock_saller
}