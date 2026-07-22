const mongoose = require("mongoose");

const cartproductSchema = mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    // Stored as String because the JWT carries the id as a string and existing
    // cart documents already use strings — keeps old and new data consistent.
    user_id: { type: String, required: true, index: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
  },
  { timestamps: true }
);

const CartProductModel = mongoose.model("cartproduct", cartproductSchema);

module.exports = { CartProductModel };
