const mongoose = require('mongoose');

const Comment = new mongoose.Schema({

    buyer_id: { type: String },
    total_price: { type: Number },
    product: {
        product_title: { type: String },
        saller_id: { type: String },
        product_id: { type: String },
        buyer_id: { type: String },
        price: { type: Number },
        quantity: { type: Number },
        total_price: { type: Number },
        discountPercentage: { type: Number },
        discountedPrice: { type: Number },
        order_confirm_by_saller: { type: String },
        order_packing: { type: String },
        order_disptach: { type: String },
        order_deliver: { type: String }
    }

});             

const order_schema = mongoose.model("order_list", Comment);
module.exports = order_schema;