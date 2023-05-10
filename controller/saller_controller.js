var register_saller_schema = require("../model/saller_schema");
var Permission_pending_schema = require("../model/Permission_pending_schema");
var product_schema = require("../model/product_schema");
var order_status_schema = require("../model/order_status_schema");
const order_schema = require("../model/order_schema");
const order_pending_for_confirmation_schema = require("../model/order_pending_for_confirmation");
var nodemailer = require('nodemailer');

// global varible declair ----------------------------------------------------
var globle_login_saller = "global saller varible is blank" /* --> jya sudhi app crash nhi thay thya sudhi global var ma data store rhe che */


// add saller ----------------------------------------------------------------
var add_saller = async (req, res) => {

  var data1 = await Permission_pending_schema.find({ email: req.body.email });
  var data2 = await register_saller_schema.find({ email: req.body.email });
  console.log("data1 : ", data1);
  console.log("data2 : ", data2);

  if (data1 == 0 & data2 == 0) {
    var data = await Permission_pending_schema.create(req.body);

    res.status(200).json({
      status: "Sign in Success",
      data
    })
  } else {
    res.status(200).json({
      status: "email id is already exist.."
    })
  }


}


// Login saller user ---------------------------------------------------------
var login = async (req, res) => {

  var data = await register_saller_schema.find({ email: req.body.email });
  // console.log("login : ", data);
  console.log("block updata : ", data);


  // asign data in globle varible
  globle_login_saller = data

  // check for block by adimn or not
  if (data[0].admin_permission_status == "granted") {
    console.log("admin_permission_status : garnted");


    if (data == 0) {
      console.log("data is : 0");

      res.status(200).json({
        status: "invalid email"
      })
    } else if (data[0].password == req.body.password) {

      if (data[0].status == 1) {
        res.status(200).json({
          status: "Your acc is already login in other device first logout.."
        })
      } else {
        var login_status = await register_saller_schema.findByIdAndUpdate(data[0]._id, { status: 1 });
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

  }else{
    res.status(200).json({
      status: "your acc. is block from admin.."
    })
  }

}


// Forgate password ----------------------------------------------------------
var forgate_password = async (req, res) => {

  // res.render('index', { title: 'Express' });
  res.status(200).json({
    status: "Success",
    msg: "mail sent.."
  });


  // for OTP send in mail
  // console.log("globle_user : ", globle_user);
  console.log("globle_user password : ", globle_login_saller[0].password);
  var forgote_password_mail = globle_login_saller[0].password;

  var generate_otp = Math.ceil(Math.random() * 10000);
  console.log("Generate OTP : ", generate_otp);

  var add_otp = await register_saller_schema.findByIdAndUpdate({ _id: globle_login_saller[0]._id }, { otp: generate_otp });

  // Sending Email.
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'mayurdodiya1234@gmail.com',
      // pass: 'tavlnpikztikyrks'
      pass: 'lkgkrvzpkgfzpayl'

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


// Compair OTP ---------------------------------------------------------------
var compair_otp = async (req, res) => {

  var data = await register_saller_schema.find({ _id: globle_login_saller[0]._id });
  console.log("cmpr otp : " , data);

  if (data[0].otp == req.body.otp) {
    var data = await register_saller_schema.findByIdAndUpdate({ _id: globle_login_saller[0]._id }, { otp_status: 1 });
    res.status(200).json({
      status: "OTP is match now you can create new password."
    });
  } else {
    res.status(200).json({
      status: "OTP is not match enter valid OTP."
    });
  } 
}


// Create new Password -------------------------------------------------------
var create_new_password = async (req, res) => {

  var check_otp_status = await register_saller_schema.find({ $and: [{ _id: globle_login_saller[0]._id }, { otp_status: 1 }] });

  if (check_otp_status == 0) {
    res.status(200).json({
      status: "data not found from globle varible."
    })
  } else {
    var data = await register_saller_schema.findByIdAndUpdate(check_otp_status[0]._id, { password: req.body.password });
    res.status(200).json({
      status: "Password succesfully resate..!"
    })

    var change_otp_status = await register_saller_schema.findByIdAndUpdate(check_otp_status[0]._id, { otp_status: 0 });
  }
}


// Logout saller -------------------------------------------------------------
var logout_saller = async (req, res) => {
  // console.log("logout:",globle_login_saller);

  var login_saller_id = globle_login_saller[0]._id;
  var data = await register_saller_schema.findByIdAndUpdate(login_saller_id, { status: 0 });

  res.status(200).json({
    status: "Logout Success.."
  })
}


// add product ---------------------------------------------------------------
var add_product = async (req, res) => {

  var data1 = await register_saller_schema.find({ _id: req.params.saller_user_id });
  console.log(data1);
  var obj = {
    user_id: data1[0]._id,
    users_name: data1[0].name,
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    discountPercentage: req.body.discountPercentage,
    rating: req.body.rating,
    stoke: req.body.stoke,
    brand: req.body.brand,
    category: req.body.category,
    images: req.body.images
  }

  var data = await product_schema.create(obj);

  res.status(200).json({
    status: "Success",
    data
  })
}


// Delete product ------------------------------------------------------------
var delete_product = async (req, res) => {

  // var data = await product_schema.find({ $regex: { title: req.params.title } });
  var data = await product_schema.findByIdAndDelete({ _id: req.params.product_id });

  res.status(200).json({
    status: "Success",
    data
  })
}


// Update product ------------------------------------------------------------
var update_product = async (req, res) => {

  var data = await product_schema.findByIdAndUpdate({ _id: req.params.product_id }, { title: req.body.title });
  var data = await product_schema.findByIdAndUpdate({ _id: req.params.product_id }, { description: req.body.description });
  var data = await product_schema.findByIdAndUpdate({ _id: req.params.product_id }, { price: req.body.price });
  var data = await product_schema.findByIdAndUpdate({ _id: req.params.product_id }, { discountPercentage: req.body.discountPercentage });
  var data = await product_schema.findByIdAndUpdate({ _id: req.params.product_id }, { rating: req.body.rating });
  var data = await product_schema.findByIdAndUpdate({ _id: req.params.product_id }, { stoke: req.body.stoke });
  var data = await product_schema.findByIdAndUpdate({ _id: req.params.product_id }, { brand: req.body.brand });
  var data = await product_schema.findByIdAndUpdate({ _id: req.params.product_id }, { category: req.body.category });
  var data = await product_schema.findByIdAndUpdate({ _id: req.params.product_id }, { images: req.body.images });

  res.status(200).json({
    status: "Success",
    data
  })
}


// view all my product -------------------------------------------------------
var view_all_product = async (req, res) => {
  var data = await product_schema.find({ user_id: req.params.user_id });

  res.status(200).json({
    status: "Success",
    data
  })
}


// pending ( when use plz install function )
// OLD Order confirm by saller -----------------------------------------------
// var confirm_order_by_saller = async (req, res) => {

//   // step-1.
//   var data = await order_status_schema.find({ $and: [{ saller_id: req.params.saller_id }, { product_id: req.params.product_id }] });

//   //console.log("saller order : ", data);
//   //console.log("buyer id : ", data[0].buyer_id);

//   var data1 = await order_status_schema.findByIdAndUpdate({ _id: data[0]._id }, { order_confirm_by_saller: "yes" });

//   // QUESTION WITH RAVI SIR
//   // // step-2 ak sathe tran condition $and operator ma chalti nthi
//   // // var found_buyer_id = data[0].buyer_id;
//   // var product_order_list = await order_schema.find({ $and: [{ saller_id: req.params.saller_id }, { product_id: req.params.product_id }, { buyer_id: data[0].buyer_id }] })



//   // step-2 (order confirm thy che te "changes" order list ma update krva mate.
//   // var found_buyer_id = data[0].buyer_id;
//   var product_order_list = await order_schema.find({ buyer_id: data[0].buyer_id })

//   var order_id = "";
//   var update_order_status = "";

//   product_order_list.forEach( product_data => {

//     order_id = product_data.id;


//   });

//   var product_details = await order_schema.findById(order_id);

//   var obj = {
//     "product_details.product.order_confirm_by_saller[0]":"yes"
//   }

//   //console.log(product_details.product.product_title[0]);

//   var product_data_update = await order_schema.findByIdAndUpdate(order_id,{"product.order_confirm_by_saller[0]":{$ne: "yes"}})

//   console.log(product_data_update.product.order_confirm_by_saller);

//   //console.log("data 2 : ", product_order_list[0].product);
//   // console.log("data 2 product count: ", product_count);
//   // console.log("data 2 : ", product_order_list[0].product.product_id);
//   // console.log("data 2 : ", product_order_list[0].product.product_id[0]);    
//   // console.log("data 2 : ", product_order_list[0].product.product_id[1]);
//   // console.log("data 2 : ", product_order_list[0].product.product_id[3]);


//   // count all object in products array.
//   var product_counter = 0;
//   for (var z = 0; z < 100 ; z++) {
//     if (product_order_list[0].product.product_title[z] === undefined) {
//       console.log(`total product is : ${z - 1}`);
//       break;
//     }
//     product_counter++;
//   }
//   console.log("product_counter : ", product_counter - 1);

// // find saller product's object_number from Product array.
//   var cnt = 0;
//   for (var z = 0; z <= product_counter - 1; z++) {

//     if (product_order_list[0].product.product_id[z] == req.params.product_id) {
//       console.log("prms product id is match : ", product_order_list[0].product.product_id[z]);
//       break;
//     }
//     cnt++;
//   }
//   console.log("objact no is : ", cnt);


//   res.status(200).json({
//     status: "Success"
//   })



// }


// View all pending Order of saller ------------------------------------------
var view_all_pending_order = async (req, res) => {
  var data = await order_pending_for_confirmation_schema.find({ saller_id: req.params.saller_id });

  res.status(200).json({
    status: "Syccess",
    data
  })
}


// Order confirm by saller ---------------------------------------------------
var confirm_order_by_saller = async (req, res) => {
  var data = await order_pending_for_confirmation_schema.find({ $and: [{ saller_id: req.params.saller_id }, { product_id: req.params.product_id }] });
  console.log(data);

  var obj = {
    product_id: data[0].product_id,
    buyer_id: data[0].buyer_id,
    saller_id: data[0].saller_id,
    product_title: data[0].product_title,
    price: data[0].price,
    quantity: data[0].quantity,
    total_price: data[0].total_price,
    discountPercentage: data[0].discountPercentage,
    discountedPrice: data[0].discountedPrice,
    images: data[0].images,
    order_confirm_by_saller: "yes"
  }

  var data1 = await order_status_schema.create(obj);

  var delete_after_confirmed = await order_pending_for_confirmation_schema.findByIdAndDelete(data[0]._id);


  res.status(200).json({
    status: "Order Confirmed"
  })
}


// order packing status update -----------------------------------------------
var order_packing_status = async (req, res) => {
  var order_id = req.params.order_id;
  var data = await order_status_schema.findByIdAndUpdate({ _id: order_id }, { order_packing: "yes" });

  res.status(200).json({
    status: "Order packing status update.."
  })

}


// order dispatch status update -----------------------------------------------
var order_dispatch_status = async (req, res) => {
  var order_id = req.params.order_id;
  var data = await order_status_schema.findByIdAndUpdate({ _id: order_id }, { order_dispatch: "yes" });

  res.status(200).json({
    status: "Order dispatch status update.."
  })

}


// Order deliver status -------------------------------------------------------
var order_deliver_status = async (req, res) => {
  var order_id = req.params.order_id;
  var data = await order_status_schema.findByIdAndUpdate({ _id: order_id }, { order_deliver: "yes" });

  res.status(200).json({
    status: "Order deliver status update.."
  })

}


//  all function are exports in --> routes/saller.js 
module.exports = {
  add_saller,
  login,
  logout_saller,
  forgate_password,
  compair_otp,
  create_new_password,
  add_product,
  delete_product,
  update_product,
  view_all_product,
  view_all_pending_order,
  confirm_order_by_saller,
  order_packing_status,
  order_dispatch_status,
  order_deliver_status
}