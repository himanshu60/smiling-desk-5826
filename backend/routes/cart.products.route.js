const express = require("express");
const { CartProductModel } = require("../models/cart.product.model");
const cartProductsRouter = express.Router();

// Return the logged-in user's cart. The user id comes from the verified token
// (req.user_id), NOT from the URL — so one user can never read another's cart.
// The :id param is kept for backward compatibility with the existing frontend
// but is ignored in favour of the authenticated id.
cartProductsRouter.get("/:id", async (req, res) => {
  try {
    const data = await CartProductModel.find({ user_id: req.user_id });
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Could not fetch cart" });
  }
});

cartProductsRouter.post("/", async (req, res) => {
  try {
    // Never trust a client-supplied _id; force ownership to the token user.
    const { _id, __v, userid, ...rest } = req.body;
    const cartproduct = new CartProductModel({
      ...rest,
      user_id: req.user_id,
      quantity: rest.quantity || 1,
    });
    await cartproduct.save();
    res.status(201).json({ msg: "Product has been added to the Cart", cartproduct });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "Could not add product to cart" });
  }
});

cartProductsRouter.delete("/:id", async (req, res) => {
  try {
    // Only allow deleting an item that belongs to the logged-in user.
    const deleted = await CartProductModel.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user_id,
    });
    if (!deleted) {
      return res.status(404).json({ msg: "Cart item not found" });
    }
    res.json({ msg: "Product removed from the cart" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Could not remove product" });
  }
});

cartProductsRouter.post("/qtn/:id", async (req, res) => {
  try {
    const { quantity } = req.body;
    const updated = await CartProductModel.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user_id },
      { quantity },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ msg: "Cart item not found" });
    }
    res.json({ msg: "Quantity has been updated", cartproduct: updated });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Could not update quantity" });
  }
});

module.exports = { cartProductsRouter };
