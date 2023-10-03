const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const connection = require("../config/db_connection");
const commentSchema = new Schema({
  cmnt_user: { type: Schema.Types.ObjectId, ref: "user", required: true },
  content: { type: String, required: true, maxLength: 2000 },
  createdAt: { type: Date, default: Date.now() },
});

const comment = connection.model("comment", commentSchema);

module.exports = comment;
