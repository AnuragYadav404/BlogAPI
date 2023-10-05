const express = require("express");
const router = express.Router();

/* GET all the articles page. */

// all articles handler
// getting all the articles
router.get("/", function (req, res, next) {
  res.json({
    msg: "This sends back all the articles",
  });
});

// creating a new article
router.post("/", function (req, res, next) {
  res.json({
    msg: "This route handles a new post creation",
  });
});

// this gets a particular article
router.get("/:articleID", function (req, res, next) {
  res.json({
    msg: "This sends back a particular article info.",
  });
});

// this updates a particular article
router.put("/:articleID", function (req, res, next) {
  res.json({
    msg: "This updates a particular article.",
  });
});

// this deletes a particular article
router.delete("/:articleID", function (req, res, next) {
  res.json({
    msg: "This deletes a particular article.",
  });
});

// this gets all the comments for a article
router.get("/:articleID/comments", function (req, res, next) {
  res.json({
    msg: "This sends back comments for a particular article",
  });
});

// this creates a new comment for a particular article
router.post("/:articleID/comments", function (req, res, next) {
  res.json({
    msg: "This creates a new comments for a particular article.",
  });
});

// this gets a particular comment for a particular article
router.get("/:articleID/comments/:commentID", function (req, res, next) {
  res.json({
    msg: "This sends back a particular comment for a particular article",
  });
});

// this updates a particular comment for a particular article
router.put("/:articleID/comments/:commentID", function (req, res, next) {
  res.json({
    msg: "This updates a particular comment for a particular article",
  });
});

// this deletes a particular comment for a particular article
router.delete("/:articleID/comments/:commentID", function (req, res, next) {
  res.json({
    msg: "This deletes a particular comment for a particular article.",
  });
});

module.exports = router;
