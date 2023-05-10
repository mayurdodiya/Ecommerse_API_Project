const mongoose = require('mongoose');

const Comment = new mongoose.Schema({
    
    product_id: { type: String },
    buyer_id: { type: String },
    saller_id: { type: String },
    product_title: { type: String },
    price: { type: Number },
    quantity: { type: Number , default:0},
    total_price: { type: Number },
    discountPercentage: { type: Number },
    discountedPrice: { type: Number , default:0},
    images: { type: Array },
    // order_confirm_by_saller: { type: String ,default:"no"},
    // order_packing: { type: String, default: "no" } 

});

const cart_schema = mongoose.model("cart", Comment);
module.exports = cart_schema;