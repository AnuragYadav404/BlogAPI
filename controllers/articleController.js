const asyncHandler = require("express-async-handler");
const article = require("../models/article");

exports.get_articles_list = asyncHandler(async function (req, res, next) {
  // this only returns a list of articles
  const articles = await article
    .find()
    .populate({
      path: "author",
      select: "username url",
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
  return res.json({
    articles,
  });
});

exports.create_article = asyncHandler(async function (req, res, next) {
  // create article is a post request to create a new article
  // the article form info will be stored in req.context.body
  // the author info will be associated with req.context.user
  const existArticle = await article
    .findOne({ aid: req.context.body.aid })
    .exec();
  if (existArticle) {
    //this means that the article already exists
    return res.json({
      msg: "Article aldready exists",
      href: existArticle.url,
    });
  } else {
    // we will now create an article
    const newArticle = new article({
      aid: req.context.body.aid,
      author: req.context.user,
      comments: [],
      title: req.context.body.title,
      content: req.context.body.content,
    });
    await newArticle.save();
    return res.json({
      msg: "Article created successfull",
      href: newArticle.url,
    });
  }
});

exports.get_article_byID = asyncHandler(async function (req, res, next) {
  // this finds and returns an article by its aid
  const arti = await article.findById(req.context.aid).exec();
  if (arti) {
    return res.json({
      arti,
    });
  } else {
    return res.json({
      msg: "No article found with this article id",
    });
  }
});

//update and delete will be done
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
