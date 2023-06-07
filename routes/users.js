var express = require('express');
var router = express.Router();
var { add_user, login, search_product, view_all_product, add_cart, update_cart, delete_cart, view_all_my_cart, /*purchase,*/ logout_user, forgate_password, buy_now, view_my_order_status, get_user_tracking_id, compair_otp, create_new_password } = require("../controller/user_controller");



// add user ------------------------------------------------------------
router.post('/add_user', add_user);


// Login ---------------------------------------------------------------
router.get('/login', login);


// click to get otp for Forgate password -------------------------------
router.post('/forgate_password', forgate_password);


// Compair OTP ---------------------------------------------------------
router.post('/compair_otp', compair_otp);


// Create new Password -------------------------------------------------
router.post('/create_new_password', create_new_password);
 

// Logout user ---------------------------------------------------------
router.post('/logout_user', logout_user);


// view all product ----------------------------------------------------
router.get('/view_all_product', view_all_product);


// Search product ------------------------------------------------------
router.get('/search_product/:title', search_product);


// Add Cart ------------------------------------------------------------
router.post('/add_cart/:product_id', add_cart);


// buy now -------------------------------------------------------------
router.post('/buy_now/:product_id', buy_now);


// get my order id after saller confirmation ---------------------------
router.get('/get_user_tracking_id/:product_id', get_user_tracking_id);


// View my order status ------------------------------------------------
router.get('/view_my_order_status/:order_id', view_my_order_status);


// View all my cart ----------------------------------------------------
router.get('/view_all_my_cart', view_all_my_cart);


// Update Cart ---------------------------------------------------------
router.put('/update_cart/:cart_id', update_cart);


// Delete Cart ---------------------------------------------------------
router.delete('/delete_cart/:cart_id', delete_cart);


// pending
// // Purchase ---------------------------------------------------------
// router.get('/purchase', purchase);



module.exports = router;
