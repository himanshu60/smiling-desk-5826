const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
   name: {type:String, required:true, trim:true},
   email: {type:String, required:true, unique:true, lowercase:true, trim:true},
   phone: {type:String, required:true, trim:true},
   password: {type:String, required:true}
}, { timestamps: true });

const UserModel = mongoose.model("user", userSchema);

module.exports = { UserModel };