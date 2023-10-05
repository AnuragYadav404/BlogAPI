const asyncHandler = require("express-async-handler");

exports.get_articles = asyncHandler(async function (req, res, next) {
  res.json({
    msg: "This sends back all the articles",
  });
});

exports.create_article = asyncHandler(async function (req, res, next) {
  res.json({
    msg: "This route handles a new post creation",
  });
});

exports.get_article_byID = asyncHandler(async function (req, res, next) {
  res.json({
    msg: "This sends back a particular article info.",
  });
});

exports.update_article_byID = asyncHandler(async function (req, res, next) {
  res.json({
    msg: "This updates a particular article.",
  });
});

exports.delete_article_byID = asyncHandler(async function (req, res, next) {
  res.json({
    msg: "This deletes a particular article.",
  });
});
