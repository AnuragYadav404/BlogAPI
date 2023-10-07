const asyncHandler = require("express-async-handler");
const article = require("../models/article");
const { body, validationResult } = require("express-validator");

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
    // first we check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        msg: "Field data failed validation checks.",
        errors: errors.array(),
        fieldData: {
          title: req.body.title,
          content: req.body.content,
        },
      });
    }

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
    const answer = {
      msg: "No article found with this article id",
    };
    if (arti && !arti.isPublished) {
      answer.hint = "Article not yet published";
      answer.article = arti;
    }
    return res.json(answer);
  }
});

//update and delete will be done
exports.update_article_byID = [
  body("title", "Title must be provided")
    .trim()
    .isLength({ min: 3, max: 190 })
    .escape(),
  body("content", "Title must not be empty")
    .trim()
    .isLength({ min: 1, max: 9500 })
    .escape(),
  asyncHandler(async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        msg: "Field data failed validation checks.",
        errors: errors.array(),
        fieldData: req.body,
      });
    } else {
      // so a mod himself can update an article
      // or the user owner
      const isMod = req.user.isModerator;
      const articleDoc = await article.findById(req.context.aid).exec();
      if (articleDoc) {
        if (
          isMod ||
          articleDoc.author.toString() == req.context.uid.toString()
        ) {
          const newArticle = new article({
            author: articleDoc.author,
            comments: articleDoc.comments,
            createdAt: articleDoc.createdAt,
            title: req.body.title,
            content: req.body.content,
            claps: articleDoc.claps,
            isPublished: articleDoc.isPublished,
            _id: articleDoc.id,
          });
          await article.findByIdAndUpdate(req.context.aid, newArticle, {});
          return res.json({
            msg: "Article update successfull",
            href: newArticle.url,
            article: newArticle,
          });
        } else {
          return res.json({
            msg: "Sorry bud you are not allowed to edit this article",
          });
        }
      } else {
        return res.json({
          msg: "This article does not exist",
        });
      }
    }
  }),
];

exports.delete_article_byID = asyncHandler(async function (req, res, next) {
  // we have an articleid -> req.context.aid
  // we have an user id for user who wants to delete -> req.context.uid
  // check if user owns this article or not
  const checkArticle = await article.findById(req.context.aid).exec();
  if (checkArticle.author.toString() === req.context.uid) {
    // this user owns this article
    await article.findByIdAndDelete(req.context.aid);
    return res.json({
      msg: "Article delete successfully",
    });
  } else {
    console.log(checkArticle.author);
    console.log(req.context.uid);
    console.log(typeof checkArticle.author);
    console.log(typeof req.context.uid);
    return res.json({
      msg: "You do not have permissions to delete this article.",
    });
  }
});

exports.get_articles_by_userID = asyncHandler(async function (req, res, next) {
  const articlesByUser = await article.find({
    author: req.context.uid,
  });
  return res.json({
    articles: articlesByUser,
  });
});

// it will only publish articles
exports.publish_article_byID = asyncHandler(async function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({
      msg: "Invalid publish request",
      errors: errors.array(),
    });
  } else {
    // check if article exists or not
    const articleDoc = await article.findById(req.context.aid);
    if (articleDoc) {
      // check if user has permissions to publish
      if (
        req.user.isModerator ||
        req.context.uid.toString() == articleDoc.author.toString()
      ) {
        if (articleDoc.isPublished) {
          // here we will update the article
          return res.json({
            msg: "article already published!",
          });
        }
        const newArticle = new article({
          author: articleDoc.author,
          comments: articleDoc.comments,
          createdAt: articleDoc.createdAt,
          title: articleDoc.title,
          claps: articleDoc.claps,
          content: articleDoc.content,
          isPublished: true,
          _id: articleDoc.id,
        });
        await article.findByIdAndUpdate(req.context.aid, newArticle, {});
        return res.json({
          msg: "article publish successfull",
          href: newArticle.url,
        });
      } else {
        return res.json({
          msg: "Sorry buddy, you don't have permissions to do so",
        });
      }
    } else {
      return res.json({
        msg: "No such article exists",
      });
    }
  }
});

// it will only unpublish articles
exports.unpublish_article_byID = asyncHandler(async function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({
      msg: "Invalid unpublish request",
      errors: errors.array(),
    });
  } else {
    // check if article exists or not
    const articleDoc = await article.findById(req.context.aid);
    if (articleDoc) {
      // check if user has permissions to publish
      if (
        req.user.isModerator ||
        req.context.uid.toString() == articleDoc.author.toString()
      ) {
        if (!articleDoc.isPublished) {
          // here we will update the article
          return res.json({
            msg: "article already un-published!",
          });
        }
        const newArticle = new article({
          author: articleDoc.author,
          comments: articleDoc.comments,
          createdAt: articleDoc.createdAt,
          title: articleDoc.title,
          claps: articleDoc.claps,
          content: articleDoc.content,
          isPublished: false,
          _id: articleDoc.id,
        });
        await article.findByIdAndUpdate(req.context.aid, newArticle, {});
        return res.json({
          msg: "article unpublish successfull",
          href: newArticle.url,
        });
      } else {
        return res.json({
          msg: "Sorry buddy, you don't have permissions to do so",
        });
      }
    } else {
      return res.json({
        msg: "No such article exists",
      });
    }
  }
});
