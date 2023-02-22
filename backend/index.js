const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");

const { userRouter } = require("./routes/user.route");
const { connection } = require("./config/db");
const { productRouter } = require("./routes/products.route");
const { auth } = require("./middlewares/auth");
const { cartProductsRouter } = require("./routes/cart.products.route");

//Middlewares
app.use(cors({origin:"*"}));
app.use(express.json());


// routes
app.use("/users", userRouter);
app.use("/products", productRouter);
app.use("/cartproducts", auth);
app.use("/cartproducts", cartProductsRouter);

app.get("/", (req, res)=>{
    res.send("Click & Collect");
})

app.get("*", (req, res)=>{
    res.send("Invalid end point");
})

app.listen(process.env.port, async()=>{
    console.log(`Server is running at http://localhost:${process.env.port}`);
    try {
        await connection;
        console.log("Connected to Database Atlas");
    } catch (error) {
        console.log("Error while connecting to Database");
        console.log(error);
    }
})