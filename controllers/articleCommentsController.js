const asyncHandler = require("express-async-handler");
const comment = require("../models/comment");

exports.get_all_comments_byArticleID = asyncHandler(async function (
  req,
  res,
  next
) {
  res.json({
    msg: "This sends back comments for a particular article",
  });
});

exports.create_new_comment_byArticleID = asyncHandler(async function (
  req,
  res,
  next
) {
  res.json({
    msg: "This creates a new comments for a particular article.",
  });
});

exports.get_comment = asyncHandler(async function (req, res, next) {
  res.json({
    msg: "This sends back a particular comment for a particular article",
  });
});

exports.update_comment = asyncHandler(async function (req, res, next) {
  res.json({
    msg: "This updates a particular comment for a particular article",
  });
});

exports.delete_comment = asyncHandler(async function (req, res, next) {
  res.json({
    msg: "This deletes a particular comment for a particular article.",
  });
});
