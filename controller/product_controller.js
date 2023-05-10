var product_schema = require("../model/product_schema");
var Register_Saller = require("../model/saller_schema"); 


// view all product function ------------------------------------------------------
var view_all_product = async (req, res) => {

    var data = await product_schema.find();

    res.status(200).json({
        status: "Success",
        data
    })
}


// view product of saller function ------------------------------------------------
var view_product_of_saller = async (req, res) => {

    var data = await product_schema.find({ user_id: req.params.user_id });

    res.status(200).json({
        status: "Success",
        data
    })
}


// Search product by title function -----------------------------------------------
var search_product = async (req, res) => {

    // var data = await product_schema.find({ $regex: { title: req.params.title } });
    var data = await product_schema.find({ title: { $regex: req.params.title } });

    res.status(200).json({
        status: "Success",
        data
    })
}


// Update product function --------------------------------------------------------
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


// export all function in product routes
module.exports = {
    view_all_product,
    search_product,
    update_product,
    view_product_of_saller
}