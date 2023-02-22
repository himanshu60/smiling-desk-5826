const mongoose = require("mongoose");

const cartproductSchema = mongoose.Schema({
   name: {type:String, required:true},
   price: {type:Number, required:true},
   category: {type:String, required:true},
   image: {type:String, required:true},
   description: {type:String, required:true},
   user_id: {type:String, required:true},
   quantity: {type:Number, required:true}
});

const CartProductModel = mongoose.model("cartproduct", cartproductSchema);

module.exports = { CartProductModel };