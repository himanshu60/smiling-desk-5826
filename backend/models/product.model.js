const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true, index: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    rating: { type: Number, required: true, min: 0, max: 5 },
    // Optional fields (defaults keep existing inserts/queries working) that
    // back the stock-status / discount-badge UX from the roadmap.
    stock: { type: Number, default: 100, min: 0 },
    discount: { type: Number, default: 0, min: 0, max: 90 },
  },
  { timestamps: true }
);

// Compound index supports the common "filter by category, sort by price" query.
productSchema.index({ category: 1, price: 1 });

const ProductModel = mongoose.model("product", productSchema);

module.exports = { ProductModel };
