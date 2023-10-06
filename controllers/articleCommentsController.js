const asyncHandler = require("express-async-handler");
const comment = require("../models/comment");
const article = require("../models/article");
const { body } = require("express-validator");

exports.get_all_comments_byArticleID = asyncHandler(async function (
  req,
  res,
  next
) {
  // article's comments field contains array which contains the commentID's
  const articleItem = await article
    .findById(req.context.aid) // articleID is the document id of the article
    .populate({
      path: "comments",
      populate: {
        path: "cmnt_user",
        select: {
          username: 1,
          name: 1,
        },
      },
    })
    .select("comments")
    .exec();
  return res.json({
    comments: articleItem.comments,
  });
});

exports.create_new_comment_byArticleID = [
  body("content", "Comment length must be min 1 and max 2000 characters")
    .trim()
    .escape()
    .isLength({
      min: 1,
      max: 2000,
    }),
  asyncHandler(async function (req, res, next) {
    // this will create a new comment for a give aid
    // articleID is the document id of the article
    const commentArticle = await article.findById(req.context.aid);
    if (commentArticle) {
      const newCmnt = new comment({
        cmnt_user: req.context.cmnt_user,
        content: req.body.content,
      });
      await newCmnt.save();
      commentArticle.comments.push(newCmnt.id);
      await commentArticle.save();
      return res.json({
        msg: "Comment posted successfully!",
      });
    } else {
      return res.json({
        msg: "Article does not exist to post a comment.",
      });
    }
  }),
];

exports.get_comment = asyncHandler(async function (req, res, next) {
  // here we are only collscanning the comment coll'n
  // but comment can be deleted for a particul article
  // we should make sure this comment is still relevant?
  // and if the article does not have this comment, it should instead be deleted
  // ****************************___________*************************
  // check for cmt in article
  const articleELe = await article
    .findById(req.context.aid)
    .select("comments")
    .exec();
  const articleComments = articleELe.comments;
  if (articleComments.includes(req.context.cmtID)) {
    const cmt = await comment
      .findById(req.context.cmtID)
      .populate({
        path: "cmnt_user",
        select: {
          username: 1,
          name: 1,
        },
      })
      .exec();
    if (cmt) {
      return res.json({
        cmt,
      });
    } else {
      return res.json({
        msg: "Comment not found",
      });
    }
  } else {
    // this comment does not belong to this article
    res.json({
      msg: "This comment does not exist",
    });
  }
});

//update and delete will be implemented later
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
