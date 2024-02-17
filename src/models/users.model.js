const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  role: String,
  lastConnection: { type: Date, default: null },
});

userSchema.plugin(passportLocalMongoose);

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
