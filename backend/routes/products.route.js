
const express = require("express");
const { ProductModel } = require("../models/product.model");
const productRouter = express.Router();

productRouter.post("/add", async (req, res) => {
    try {
        const product = new ProductModel(req.body);
        await product.save();
        res.send("Product added");
    } catch (error) {
        console.log(error);
        res.send(error);
    }
})

productRouter.get("/", async (req, res) => {
    const category =req.query.category; 
    // const {filtMobiles=["mobiles"]}=req.query;
    // const {filtLaptops=["laptops"]}=req.query;
    // const {filtGroceries=["groceries"]}=req.query;
    const order = req.query.sort;
    const title = req.query.title;
    const user_id=req.body;
    try {
        //    if(category){
        //     const data = await ProductModel.find({ category });
        //     res.json(data);
        // }

        if (category) {
            const data = await ProductModel.find({$and:[{user_id },{category:{$in:category}}]});
            res.json(data);

        }
        //  else if (filtLaptops ) {
        //     const data = await ProductModel.find({$and:[{user_id },{category:{$in:filtLaptops}}]});
        //     res.json(data);

        // }
        // else if (filtGroceries) {
        //     const data = await ProductModel.find({$and:[{user_id },{category:{$in:filtGroceries}}]});
        //     res.json(data);

        // }

        
        else if (order && category) {
            if (order == "asc") {
                const data = await ProductModel.find({ category }).sort({ price: 1 });
                res.json(data);
            } else if (order == "dsc") {
                const data = await ProductModel.find({ category }).sort({ price: -1 });
                res.json(data);
            }
        } else if (order) {
            if (order == "asc") {
                const data = await ProductModel.find().sort({ price: 1 });
                res.json(data);
            } else if (order == "dsc") {
                const data = await ProductModel.find().sort({ price: -1 });
                res.json(data);
            }
        } else if (title) {
            const data = await ProductModel.find({ name: { $regex: title, $options: "si" } });
            res.json(data);
            // console.log(title)
        } else {
            const data = await ProductModel.find();
            res.json(data);
        }
    } catch (error) {
        console.log(error);
        res.send(error);
    }
})

module.exports = { productRouter }