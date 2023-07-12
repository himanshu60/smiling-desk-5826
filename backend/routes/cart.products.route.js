const express = require("express");
const { CartProductModel } = require("../models/cart.product.model");
const cartProductsRouter = express.Router();

cartProductsRouter.get("/:id", async (req, res) => {
  // const uid = req.body.user_id
  const id = req.params.id;
  try {
    if (id) {
      const data = await CartProductModel.find({ user_id: id });
      res.send(data);
    } else {
      res.send([]);
    }
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

cartProductsRouter.post("/", async (req, res) => {
  try {
    const cartproduct = new CartProductModel(req.body);
    await cartproduct.save();
    res.send("Product has been added to the Cart");
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

cartProductsRouter.delete("/:id", async (req, res) => {
  try {
    await CartProductModel.findByIdAndDelete({ _id: req.params.id });
    res.send("Product removed from the cart");
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

cartProductsRouter.post("/qtn/:id", async (req, res) => {
  try {
    const a = req.params.id;
    await CartProductModel.findByIdAndUpdate({ _id: a }, req.body);
    console.log("done");
    res.send("quantity has been updated");
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

module.exports = { cartProductsRouter };
