const asyncHandler = require("express-async-handler");
const article = require("../models/article");
const { body } = require("express-validator");

exports.get_articles_list = asyncHandler(async function (req, res, next) {
  // this only returns a list of articles
  const articles = await article
    .find()
    .populate({
      path: "author",
      select: {
        username: 1,
      },
    })
    .select({
      createdAt: 1,
      title: 1,
      claps: 1,
      isPublished: 1,
    })
    .exec();
  return res.json({
    articles,
  });
});

exports.create_article = [
  body("title", "Title must be provided")
    .trim()
    .isLength({ min: 3, max: 190 })
    .escape(),
  body("content", "Title must not be empty")
    .trim()
    .isLength({ min: 1, max: 9500 })
    .escape(),
  asyncHandler(async function (req, res, next) {
    // create article is a post request to create a new article
    // the article form info will be stored in req.context.body
    // the author info will be associated with req.context.user

    //existing article check is invalid
    // an author is given the possibility of creating
    //  duplicate articles if he want
    // const existArticle = await article.findById(req.context.body.aid).exec();
    // if (existArticle) {
    //   //this means that the article already exists
    //   return res.json({
    //     msg: "Article aldready exists",
    //     href: existArticle.url,
    //   });
    // } else {

    // }
    // we will now create an article
    const newArticle = new article({
      author: req.context.user,
      comments: [],
      title: req.body.title,
      content: req.body.content,
    });
    await newArticle.save();
    return res.json({
      msg: "Article created successfull",
      href: newArticle.url,
    });
  }),
];

exports.get_article_byID = asyncHandler(async function (req, res, next) {
  // this finds and returns an article by its aid
  const arti = await article
    .findById(req.context.aid)
    .populate({
      path: "author",
      select: {
        username: 1,
      },
    })
    .exec();
  if (arti && arti.isPublished) {
    // here i can also pass in a check
    // if isPublished is true it is accessible
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
