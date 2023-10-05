const asyncHandler = require("express-async-handler");
const article = require("../models/article");

exports.get_articles_list = asyncHandler(async function (req, res, next) {
  // this only returns a list of articles
  const articles = await article
    .find()
    .populate({
      path: "author",
      select: "username",
    })
    .select({
      aid: 1,
      createdAt: 1,
      title: 1,
      claps: 1,
      isPublished: 1,
      url: 1,
      author: 1,
    })
    .exec();
  res.json({
    articles,
  });
  res.json({
    articles,
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
