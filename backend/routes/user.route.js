const { Router } = require("express");
const userRouter = Router();
const { UserModel } = require("../models/user.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

userRouter.get("/", async (req, res) => {
    try {
        const data = await UserModel.find();
        res.json(data);
    } catch (error) {
        console.log(error);
        res.json({ msg: error });
    }
})


userRouter.post("/register", async (req, res) => {
    const { name, email, phone, password } = req.body;
    try {
        bcrypt.hash(password, 5, async (err, hashed_pass) => {
            if (err) {
                res.send("Something went wrong");
                console.log(err);
            } else {
                const user = new UserModel({ name, email, phone, password: hashed_pass });
                await user.save();
                res.json("User has been registered");
            }
        });
    } catch (error) {
        console.log(error);
        res.json({ msg: error });
    }
});


userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    try {
        if (user) {
            bcrypt.compare(password, user.password, (err, result) => {
                if (err) {
                    res.status(500).send("Something went wrong");
                    console.log(err);
                } else {
                    if (result) {
                        const token = jwt.sign({ _id: user._id }, process.env.key);
                        console.log(token)
                        res.json({ msg: "Login Successfull", token,"name": user.name,"userid":user._id });
                    
                    } else {
                        res.status(401).json("Wrong Credentials");
                    }
                }
            })
        } else {
            res.status(404).json("User Not found");
        }
    } catch (error) {
        console.log(error);
        res.json({ msg: error });
    }
});




module.exports = { userRouter };