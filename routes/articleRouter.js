const express = require("express");
const router = express.Router();
const article_controller = require("../controllers/articleController");
const article_comment_controller = require("../controllers/articleCommentsController");
/* GET all the articles page. */
const passport = require("passport");
// all articles handler
// getting all the articles
router.get("/", article_controller.get_articles_list);

// creating a new article
router.post(
  "/",
  function (req, res, next) {
    if (req.isAuthenticated()) {
      req.context = {
        user: req.user,
      };
      req.context.body = req.body;
      next();
    } else {
      console.log(req.user);

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
    req.context = {
      aid: req.params.articleID,
    };
    next();
  },
  article_controller.get_article_byID
);

// this updates a particular article
router.put("/:articleID", article_controller.update_article_byID);

// this deletes a particular article
router.delete("/:articleID", article_controller.delete_article_byID);

// this gets all the comments for a article
router.get(
  "/:articleID/comments",
  article_comment_controller.get_all_comments_byArticleID
);

// this creates a new comment for a particular article
router.post(
  "/:articleID/comments",
  article_comment_controller.create_new_comment_byArticleID
);

// this gets a particular comment for a particular article
router.get(
  "/:articleID/comments/:commentID",
  article_comment_controller.get_comment
);

// this updates a particular comment for a particular article
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
