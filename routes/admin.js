var express = require('express');
var router = express.Router();
// var { add_user, login } = require("../controller/register_controller");
var { add_admin, login, permision_pending, permission_granted, view_all_active_saller, find_saller_by_name, view_perticular_saller_product, logout_admin, block_saller, unblock_saller } = require("../controller/admin_controller");

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });


// Add admin -----------------------------------------------------------
router.post('/add_admin', add_admin);


// Login ---------------------------------------------------------------
router.get('/login', login);


// Logout --------------------------------------------------------------
router.post('/logout_admin', logout_admin);


//View permision pending of saller -------------------------------------
router.get('/permision_pending', permision_pending);


// Give permission to saller -------------------------------------------
router.get('/permission_granted/:user_id', permission_granted);


// View all active saller ----------------------------------------------
router.get('/active_saller', view_all_active_saller);


// Find saller by name -------------------------------------------------
router.get('/find_saller_by_name/:name', find_saller_by_name);


// View perticular saller's product ------------------------------------
router.get('/view_perticular_saller_product/:user_id', view_perticular_saller_product);


// block saller --------------------------------------------------------
router.get('/block_saller', block_saller);


// unblock saller ------------------------------------------------------
router.get('/unblock_saller', unblock_saller);


module.exports = router;
 