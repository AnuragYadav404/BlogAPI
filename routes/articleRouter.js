const express = require("express");
const router = express.Router();
const article_controller = require("../controllers/articleController");
const article_comment_controller = require("../controllers/articleCommentsController");
/* GET all the articles page. */
const mongoose = require("mongoose");
const passport = require("passport");
// all articles handler
// getting all the articles
router.get("/", article_controller.get_articles_list);

// creating a new article
router.post(
  "/",
  function (req, res, next) {
    if (req.isAuthenticated()) {
      // if(req.user.isAuthor) check if user is author or not
      req.context = {
        user: req.user,
      };
      next();
    } else {
      return res.json({
        msg: "User not logged in. Cannot create a article.",
      });
    }
  },
  article_controller.create_article
);

// this gets a particular article
router.get(
  "/:articleID",
  (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params.articleID)) {
      return res.json({
        msg: "Article does not exist",
      });
    }
    req.context = {
      aid: req.params.articleID, // articleID is the document id of the article
    };
    next();
  },
  article_controller.get_article_byID
);

// this updates a particular article
router.put("/:articleID", article_controller.update_article_byID);

// this deletes a particular article
router.delete(
  "/:articleID",
  function (req, res, next) {
    if (!mongoose.isValidObjectId(req.params.articleID)) {
      return res.json({
        msg: "Article does not exist",
      });
    }
    if (req.isAuthenticated()) {
      req.context = {
        uid: req.user.id,
        aid: req.params.articleID,
      };
      next();
    } else {
      return res.json({
        msg: "you must be logged in to delete an article",
      });
    }
  },
  article_controller.delete_article_byID
);

// this gets all the comments for a article
router.get(
  "/:articleID/comments",
  function (req, res, next) {
    if (!mongoose.isValidObjectId(req.params.articleID)) {
      return res.json({
        msg: "Article does not exist",
      });
    }
    req.context = {
      aid: req.params.articleID,
    };
    next();
  },
  article_comment_controller.get_all_comments_byArticleID
);

// this creates a new comment for a particular article
router.post(
  "/:articleID/comments",
  function (req, res, next) {
    if (!mongoose.isValidObjectId(req.params.articleID)) {
      return res.json({
        msg: "Article does not exist",
      });
    } else if (!req.isAuthenticated()) {
      return res.json({
        msg: "You must be logged in to comment on an article.",
      });
    } else {
      req.context = {
        aid: req.params.articleID,
        cmnt_user: req.user,
      };
      next();
    }
  },
  article_comment_controller.create_new_comment_byArticleID
);

// this gets a particular comment for a particular article
// this can be implemented by only comment collscan
// should we also check if articleID and commentID is valid combo?
router.get(
  "/:articleID/comments/:commentID",
  function (req, res, next) {
    if (!mongoose.isValidObjectId(req.params.articleID)) {
      return res.json({
        msg: "Article does not exist",
      });
    } else if (!mongoose.isValidObjectId(req.params.commentID)) {
      return res.json({
        msg: "Comment does not exist",
      });
    } else {
      req.context = {
        aid: req.params.articleID,
        cmtID: req.params.commentID,
      };
      next();
    }
  },
  article_comment_controller.get_comment
);

// this updates a particular comment for a particular article
// this can be implemented by only comment collscan
// should we also check if articleID and commentID is valid combo?
router.put(
  "/:articleID/comments/:commentID",
  article_comment_controller.update_comment
);

// this deletes a particular comment for a particular article
router.delete(
  "/:articleID/comments/:commentID",
  article_comment_controller.delete_comment
);

module.exports = router;
