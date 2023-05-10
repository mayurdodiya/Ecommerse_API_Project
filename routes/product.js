var express = require('express');
var router = express.Router();
var { view_all_product, update_product, view_product_of_saller } = require("../controller/product_controller");

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

// // add product ----------------------------------------------------------------
// router.post('/add_product/:saller_user_id',add_product);


// view all product -----------------------------------------------------------
router.get('/view_all_product', view_all_product );


// view product of each saller ---------------------------------------------------
router.get('/view_product_of_saller/:user_id', view_product_of_saller );


// // Delete product -------------------------------------------------------------
// router.delete('/delete_product/:product_id',);


// Update product -------------------------------------------------------------
router.put('/update_product/:product_id', update_product );


module.exports = router; 
 