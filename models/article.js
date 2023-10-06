const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const connection = require("../config/db_connection");

const articleSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "user", required: true },
  comments: [{ type: Schema.Types.ObjectId, ref: "comment" }],
  createdAt: { type: Date, default: Date.now() },
  title: { type: String, required: true, maxLength: 200 },
  claps: { type: Number, default: 0 },
  content: { type: String, required: true, maxLength: 10000 },
  isPublished: { type: Boolean, default: false },
});

articleSchema.virtual("url").get(function () {
  return `/articles/${this._id}`;
});
articleSchema.set("toJSON", {
  virtuals: true,
});

const article = connection.model("article", articleSchema);

module.exports = article;
