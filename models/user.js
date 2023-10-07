const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const connection = require("../config/db_connection");
const userSchema = new Schema({
  // uid for every user
  username: { type: String, required: true, minLength: 3, maxLength: 30 },
  // auth details for user
  hash: { type: String, required: true },
  salt: { type: String, required: true },
  // permission details for user
  isAuthor: { type: Boolean, default: false },
  isModerator: { type: Boolean, default: false },
  // every user can be an author
  // personal details for user
  name: { type: String, required: true, minLength: 2, maxLength: 100 },
  doj: { type: Date, default: Date.now() },
  description: { type: String, maxLength: 1000 },
});

userSchema.virtual("url").get(function () {
  return `/users/${this._id}`;
});
userSchema.set("toJSON", {
  virtuals: true,
});

const user = connection.model("user", userSchema);

module.exports = user;
