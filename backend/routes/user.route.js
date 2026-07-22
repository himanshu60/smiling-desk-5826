const { Router } = require("express");
const userRouter = Router();
const { UserModel } = require("../models/user.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

userRouter.post("/register", async (req, res) => {
    const { name, email, phone, password } = req.body;

    if ([name, email, phone, password].some((f) => typeof f !== "string" || !f)) {
        return res.status(400).json({ msg: "All fields are required" });
    }
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) {
        return res.status(400).json({ msg: "Please enter a valid email address" });
    }

    try {
        const existing = await UserModel.findOne({ email });
        if (existing) {
            return res.status(409).json({ msg: "An account with this email already exists" });
        }

        const hashed_pass = await bcrypt.hash(password, 5);
        const user = new UserModel({ name, email, phone, password: hashed_pass });
        await user.save();
        res.status(201).json({ msg: "User has been registered" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Something went wrong during registration" });
    }
});

userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
        return res.status(400).json({ msg: "Email and password are required" });
    }

    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        const result = await bcrypt.compare(password, user.password);
        if (!result) {
            return res.status(401).json({ msg: "Wrong credentials" });
        }

        const token = jwt.sign({ _id: user._id }, process.env.key, { expiresIn: "7d" });
        res.json({
            msg: "Login Successful",
            token,
            name: user.name,
            userid: user._id,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Something went wrong during login" });
    }
});

module.exports = { userRouter };
