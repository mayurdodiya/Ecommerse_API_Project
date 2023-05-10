const mongoose = require('mongoose');

const Comment = new mongoose.Schema({
    saller_id: { type: String },
    users_name : { type : String},
    id: { type: String },
    title: { type: String },
    description: { type: String },
    price: { type: Number },
    discountPercentage: { type: Number },
    rating: { type: Number },
    stoke: { type: Number },
    brand: { type: String },
    category: { type: String },
    images: { type: Array }
});

const product_schema = mongoose.model("Product", Comment);
module.exports = product_schema;
