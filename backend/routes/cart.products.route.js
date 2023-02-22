
const express = require("express");
const { CartProductModel } = require("../models/cart.product.model");
const cartProductsRouter = express.Router();


cartProductsRouter.get("/", async (req, res) => {
    const uid = req.body.user_id
    try {
        const data = await CartProductModel.find({ user_id: uid });
        res.send(data);
    } catch (error) {
        console.log(error);
        res.send(error);
    }
})

cartProductsRouter.post('/', async (req, res) => {
    try {
        const cartproduct = new CartProductModel({ ...req.body, quantity: 1 });
        await cartproduct.save();
        res.send("Product has been added to the Cart");
    } catch (error) {
        console.log(error);
        res.send(error);
    }
});

cartProductsRouter.delete('/:id', async (req, res) => {
    try {
        await CartProductModel.findByIdAndDelete({ _id: req.params.id });
        res.send("Product removed from the cart");
    } catch (error) {
        console.log(error);
        res.send(error);
    }
})

module.exports = { cartProductsRouter }
