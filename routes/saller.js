var express = require('express');
var router = express.Router();
var { add_saller, login, add_product, delete_product, update_product, view_all_product, logout_saller, confirm_order_by_saller, view_all_pending_order, order_packing_status, order_dispatch_status, order_deliver_status, forgate_password, compair_otp, create_new_password } = require("../controller/saller_controller");

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// }); 


// add saller -----------------------------------------------------------------
router.post('/add_saller', add_saller);


// Login ----------------------------------------------------------------------
router.get('/login', login);


// click to get otp for Forgate password --------------------------------------
router.post('/forgate_password', forgate_password);


// Compair OTP ----------------------------------------------------------------
router.post('/compair_otp', compair_otp);


// Create new Password --------------------------------------------------------
router.post('/create_new_password', create_new_password);


// Logout saller --------------------------------------------------------------
router.post('/logout_saller', logout_saller);


// add product ----------------------------------------------------------------
router.post('/add_product/:saller_user_id', add_product);


// Delete product -------------------------------------------------------------
router.delete('/delete_product/:product_id', delete_product);


// Update product -------------------------------------------------------------
router.put('/update_product/:product_id', update_product);


// View all my product --------------------------------------------------------
router.get('/view_all_my_product/:user_id', view_all_product);


// pending for query
// //OLD Order confirm by saller ----------------------------------------------
// router.get('/confirm_order_by_saller/:saller_id/:product_id', confirm_order_by_saller);


// View all pending Order of saller -------------------------------------------
router.get('/view_all_pending_order/:saller_id', view_all_pending_order);


// Order confirm by saller ----------------------------------------------------
router.get('/confirm_order_by_saller/:saller_id/:product_id', confirm_order_by_saller);


// Order packing status -------------------------------------------------------
router.get('/order_packing/:order_id', order_packing_status);


// Order dispatch status ------------------------------------------------------
router.get('/order_dispatch/:order_id', order_dispatch_status);


// Order deliver status -------------------------------------------------------
router.get('/order_deliver/:order_id', order_deliver_status);


module.exports = router;
