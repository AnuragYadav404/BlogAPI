const asyncHandler = require("express-async-handler");
const comment = require("../models/comment");
const article = require("../models/article");

exports.get_all_comments_byArticleID = asyncHandler(async function (
  req,
  res,
  next
) {
  // article's comments field contains array which contains the commentID's
  const comments = await article
    .findById(req.context.aid)
    .populate("comments")
    .select("comments")
    .exec();
  return res.json({
    comments,
  });
});

exports.create_new_comment_byArticleID = asyncHandler(async function (
  req,
  res,
  next
) {
  // this will create a new comment for a give aid
  const commentArticle = await article.findById(req.context.aid);
  if (commentArticle) {
    const newCmnt = new comment({
      cmnt_user: req.context.cmnt_user,
      content: req.context.body.content,
    });
    await newCmnt.save();
    commentArticle.comments.push(newCmnt.id);
    await commentArticle.save();
    return;
  } else {
    return res.json({
      msg: "Article does not exist to post a comment.",
    });
  }
});

exports.get_comment = asyncHandler(async function (req, res, next) {
  const cmt = await comment
    .findById(req.context.cmtID)
    .populate("cmnt_user")
    .exec();
  if (cmt) {
    return res.json({
      cmt,
    });
  } else {
    return res.json({
      msg: "Comment not find",
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
