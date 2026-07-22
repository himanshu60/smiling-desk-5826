const express = require("express");
const { ProductModel } = require("../models/product.model");
const productRouter = express.Router();

productRouter.post("/add", async (req, res) => {
    try {
        const product = new ProductModel(req.body);
        await product.save();
        res.status(201).json({ msg: "Product added", product });
    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: "Could not add product" });
    }
});

productRouter.get("/", async (req, res) => {
    const { category, sort, title } = req.query;

    try {
        // Build the filter incrementally so category, title and sort compose.
        const filter = {};
        if (category) filter.category = category;
        if (title) filter.name = { $regex: title, $options: "i" };

        let query = ProductModel.find(filter);

        if (sort === "asc") query = query.sort({ price: 1 });
        else if (sort === "dsc") query = query.sort({ price: -1 });

        const data = await query;
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Could not fetch products" });
    }
});

module.exports = { productRouter };
