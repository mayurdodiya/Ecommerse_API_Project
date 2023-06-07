var user_schema = require("../model/user_schema");
const product_schema = require("../model/product_schema");
const cart_schema = require("../model/cart_schema");
const order_schema = require("../model/order_schema");
var nodemailer = require('nodemailer');
const order_status_schema = require("../model/order_status_schema");
const order_pending_for_confirmation_schema = require("../model/order_pending_for_confirmation");

// Global variable declair ---------------------------------------------
var globle_login_user = "global user varible is blank" /* --> jya sudhi app crash nhi thay thya sudhi global var ma data store rhe che */


// add normal user -----------------------------------------------------
var add_user = async (req, res) => {
  var data1 = await user_schema.find({ email: req.body.email });

  if (data1 == 0) {
    var data = await user_schema.create(req.body);
    res.status(200).json({
      status: "your acc is register now you can login.."
    })
  } else {

    res.status(200).json({
      status: "email id is already exist..",
    })
  }

}


// Login normal user ---------------------------------------------------
var login = async (req, res) => {

  var data = await user_schema.find({ email: req.body.email });

  if (data == 0) {
    console.log("data is : 0");

    res.status(200).json({
      status: "invalid email id"
    })
  } else if (data[0].password == req.body.password) {

    if (data[0].status == 1) {
      res.status(200).json({
        status: "Your acc is already login please logout first..",
      })
    } else {
      var store_id = data[0]._id;
      var login_status = await user_schema.findByIdAndUpdate(store_id, { status: 1 });

      res.status(200).json({
        status: "Login Success..",
        data
      })

      // asign data in global varible
      var asign_data = await user_schema.find({ email: req.body.email });
      globle_login_user = asign_data;

    }
  } else {
    res.status(200).json({
      status: "invalid password.."
    })

    // asign data in global varible
    var asign_data = await user_schema.find({ email: req.body.email });
    globle_login_user = asign_data;
    console.log("asign_data : ", asign_data);
    console.log("globle login user : ", globle_login_user);
  }

}


// Forgate password ----------------------------------------------------
var forgate_password = async (req, res) => {

  // res.render('index', { title: 'Express' });
  res.status(200).json({
    status: "Success",
    msg: "mail sent.."
  });


  // for OTP send in mail
  // console.log("globle_user : ", globle_user);
  console.log("globle_user password : ", globle_login_user[0].password);
  var forgote_password_mail = globle_login_user[0].password;

  var generate_otp = Math.ceil(Math.random() * 10000);
  console.log("Generate OTP : ", generate_otp);

  var add_otp = await user_schema.findByIdAndUpdate({ _id: globle_login_user[0]._id }, { otp: generate_otp });

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
    text: `Thank you for connecting with Us Mrs.Mira dodiya..! (auto generated email sent by your fionce..)
          your password is : ${generate_otp}.`
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

}


// Compair OTP ---------------------------------------------------------
var compair_otp = async (req, res) => {

  try {
    var data = await user_schema.find({ _id: globle_login_user[0]._id });
    console.log("cmpr otp : ", data);

    if (data[0].otp == req.body.otp) {
      var data = await user_schema.findByIdAndUpdate({ _id: globle_login_user[0]._id }, { otp_status: 1 });
      res.status(200).json({
        status: "OTP is match now you can create new password."
      });

      var delete_otp = await user_schema.findByIdAndUpdate({ _id: globle_login_user[0]._id }, { otp: 0 });
      console.log("delete otp : ", delete_otp);

    } else {
      res.status(200).json({
        status: "OTP is not match enter valid OTP."
      });
    }
  } catch (error) {
    res.status(200).json({
      status: "error..!",
      error
    });
  }

}


// Create new Password -------------------------------------------------
var create_new_password = async (req, res) => {

  var check_otp_status = await user_schema.find({ $and: [{ _id: globle_login_user[0]._id }, { otp_status: 1 }] });

  if (check_otp_status == 0) {
    res.status(200).json({
      status: "data not found from globle varible."
    })
  } else {
    var data = await user_schema.findByIdAndUpdate(check_otp_status[0]._id, { password: req.body.password });
    res.status(200).json({
      status: "Password succesfully resate..!"
    })

    var change_otp_status = await user_schema.findByIdAndUpdate(check_otp_status[0]._id, { otp_status: 0 });
  }
}


// Logout user ---------------------------------------------------------
var logout_user = async (req, res) => {
  // console.log("globle_login_user logout : ", globle_login_user); 
  var login_user_id = globle_login_user[0]._id;
  var login_user_status = globle_login_user[0].status;
  console.log(login_user_id);
  console.log(login_user_status);

  var data = await user_schema.findByIdAndUpdate(login_user_id, { status: 0 });

  res.status(200).json({
    status: "Logout Success..",
  })
}


// view all product ----------------------------------------------------
var view_all_product = async (req, res) => {
  var data = await product_schema.find();

  res.status(200).json({
    status: "Success",
    data
  })
}


// Search product ------------------------------------------------------
var search_product = async (req, res) => {
  var data = await product_schema.find({ title: { $regex: req.params.title } });

  res.status(200).json({
    status: "Success",
    data
  })
}


// Add Cart ------------------------------------------------------------
var add_cart = async (req, res) => {

  var login_id = globle_login_user[0]._id;
  var data = await product_schema.find({ _id: req.params.product_id });

  var obj = {
    product_id: data[0]._id,
    buyer_id: login_id,
    saller_id: data[0].saller_id,
    product_title: data[0].title,
    price: data[0].price,
    quantity: data[0].quantity,
    total_price: data[0]._price,
    discountPercentage: data[0].discountPercentage,
    discountedPrice: data[0].discountedPrice,
    images: data[0].images
  }

  var already_cart = await cart_schema.find({ $and: [{ product_id: req.params.product_id }, { user_id: login_id }] });
  // for count
  var already_cart_count = await cart_schema.find({ $and: [{ product_id: req.params.product_id }, { user_id: login_id }] }).count();

  console.log(already_cart_count);
  if (already_cart_count >= 1) {
    res.status(200).json({
      status: "You already cart this product."
    })
  } else {
    var data1 = await cart_schema.create(obj);
    res.status(200).json({
      status: "Success",
      data1
    })
  }

}


// buy now -------------------------------------------------------------
var buy_now = async (req, res) => {
  var data = await product_schema.findById(req.params.product_id);
  console.log(data);
  console.log(data._id);
  console.log("globle user : ", globle_login_user);

  var obj = {
    product_id: data._id,
    buyer_id: globle_login_user[0]._id,
    saller_id: data.saller_id,
    product_title: data.title,
    price: data.price,
    quantity: data.quantity,
    total_price: data.total_price,
    discountPercentage: data.discountPercentage,
    discountedPrice: data.discountedPrice,
    images: data.images,
    order_confirm_by_saller: "no"
  }

  var data2 = await order_pending_for_confirmation_schema.create(obj);

  res.status(200).json({
    status: "Your order generated Successfully now pending for saller's confirmation..",
    // data2
  })
}


// get my order id after saller confirmation ---------------------------
var get_user_tracking_id = async (req, res) => {

  var data = await order_status_schema.find({ $and: [{ product_id: req.params.product_id }, { buyer_id: globle_login_user[0]._id }] });
  console.log("data is : ", data);
  console.log("globle gggg user is : ", globle_login_user);

  if (data == 0) {
    res.status(200).json({
      status: "Order confirmation is pending from saller please wait till confirmation.."
    })
  } else {
    res.status(200).json({ 
      status: `your tarcking id is : ${data[0]._id}`
    })
  }
} 


// View my order status ------------------------------------------------
var view_my_order_status = async (req, res) => {
  var order_id = req.params.order_id;
  var data = await order_status_schema.findById(order_id);
  console.log(data);

  if (data === null) {
    res.status(200).json({
      status: "your order confirmation is pending from saller.."
    })
  } else {
    res.status(200).json({
      status: "Success..",
      data
    })
  }
}


// View all my cart ----------------------------------------------------
var view_all_my_cart = async (req, res) => {

  var login_user_id = globle_login_user[0]._id;
  var data = await cart_schema.find({ user_id: login_user_id });

  res.status(200).json({
    status: "Success",
    data
  })
}


// Update Cart ---------------------------------------------------------
var update_cart = async (req, res) => {

  var login_user_status = globle_login_user[0].status;
  console.log("login user status : ", login_user_status);

  console.log(globle_login_user);

  if (login_user_status == 1) {
    var data = await cart_schema.findByIdAndUpdate({ _id: req.params.cart_id }, { quantity: req.body.quantity });
    res.status(200).json({
      status: "Success",
      data
    })
  } else {
    res.status(200).json({
      status: "Your acc. is not login",
    })
  }

}


// Delete Cart ---------------------------------------------------------
var delete_cart = async (req, res) => {
  var data = await cart_schema.findByIdAndDelete({ _id: req.params.cart_id });

  res.status(200).json({
    status: "Success",
    data
  })
}


// Old Purchase --------------------------------------------------------
{
// var purchase = async (req, res) => {

//   // step-1.
//   var login_id = globle_login_user[0]._id;
//   // console.log("login id : ", login_id);

//   // step-2.
//   var all_data = await cart_schema.find({ buyer_id: login_id })
//   var total_count = await cart_schema.find({ buyer_id: login_id }).count()
//   // console.log("all_data : ", all_data);
//   // console.log("total count : ", total_count);

//   // step-3.
//   // This code use for buyer's all product's total price submission
//   var sub = 0;
//   for (var z = 0; z < total_count; z++) {
//     console.log(`product ${z + 1} :`, all_data[z].price);
//     sub = sub + all_data[z].price
//   }
//   console.log("Grand Total : ", sub);

//   // step-4.
//   // this code for generate purchase ENTERY
//   var obj = {
//     buyer_id: login_id,
//     total_price: sub
//   }
//   var data1 = await order_schema.create(obj);
//   // console.log(data1);

//   // step-5.
//   // This code use for add product in buyer's orderlist
//   for (var z = 0; z < total_count; z++) {

//     var product_title = all_data[z].product_title;
//     var saller_id = all_data[z].saller_id;
//     var product_id = all_data[z].product_id;
//     var buyer_id = all_data[z].buyer_id;
//     var price = all_data[z].price;
//     var quantity = all_data[z].quantity;
//     var discountPercentage = all_data[z].discountPercentage;
//     var discountedPrice = all_data[z].discountedPrice;
//     var order_confirm_by_saller = "no";
//     var order_packing = "no";
//     var order_disptach = "no";
//     var order_deliver = "no";

//     var data_push = await order_schema.findByIdAndUpdate({ _id: data1._id }, {
//       $push:
//       {
//         product: {
//           product_title: product_title,
//           saller_id: saller_id,
//           product_id: product_id,
//           buyer_id: buyer_id,
//           price: price,
//           quantity: quantity,
//           discountPercentage: discountPercentage,
//           discountedPrice: discountedPrice,
//           order_confirm_by_saller: order_confirm_by_saller,
//           order_packing: order_packing,
//           order_disptach: order_disptach,
//           order_deliver: order_deliver,
//         }
//       }
//     })


//   }

//   // step-6.
//   // This code use for saller confirmation process
//   var find_order_of_saller = await cart_schema.find({ buyer_id: data_push.buyer_id });
//   console.log("find all order of buyer : ", find_order_of_saller);

//   var find_order_list_id = await order_schema.find({ buyer_id: data_push.buyer_id });
//   console.log("order list id : ", find_order_list_id[0]._id);

//   for (var z = 0; z < total_count; z++) {
//     var obj1 = {
//       order_list_id: find_order_list_id[0]._id,
//       product_id: find_order_of_saller[z].product_id,
//       buyer_id: find_order_of_saller[z].buyer_id,
//       saller_id: find_order_of_saller[z].saller_id,
//       product_title: find_order_of_saller[z].product_title,
//       price: find_order_of_saller[z].price,
//       quantity: find_order_of_saller[z].quantity,
//       total_price: find_order_of_saller[z].total_price,
//       discountPercentage: find_order_of_saller[z].discountPercentage,
//       discountedPrice: find_order_of_saller[z].discountedPrice,
//       images: find_order_of_saller[z].images,
//       order_confirm_by_saller: find_order_of_saller[z].order_confirm_by_saller,
//     }

//     // var create_pending_order = await order_status_schema.create(obj1);
//   }



//   res.status(200).json({
//     status: "Success",
//     msg: "your order is pending for saller's confirmation..",
//     // data1,
//     // data_push
//   })
// }
}


//  all function are exports in --> routes/user.js 
module.exports = {
  add_user,
  login,
  forgate_password,
  compair_otp,
  create_new_password,
  logout_user,
  view_all_product,
  search_product,
  add_cart,
  buy_now,
  get_user_tracking_id,
  view_my_order_status,
  view_all_my_cart,
  update_cart,
  delete_cart,
  // purchase
}