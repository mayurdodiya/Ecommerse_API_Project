const mongoose = require('mongoose');

const Comment = new mongoose.Schema({

    product_id: { type: String },
    buyer_id: { type: String },
    saller_id: { type: String },
    product_title: { type: String },
    price: { type: Number },
    quantity: { type: Number, default: 0 },
    total_price: { type: Number },
    discountPercentage: { type: Number },
    discountedPrice: { type: Number, default: 0 },
    images: { type: Array },
    order_confirm_by_saller: { type: String },
    order_packing: { type: String, default: "no" },
    order_dispatch: { type: String, default: "no" },
    order_deliver: { type: String, default: "no" }

});

// const pending_order_schema = mongoose.model("buyer_pending_order_for_confirmation", Comment);
const order_status_schema = mongoose.model("order_status", Comment);
module.exports = order_status_schema;