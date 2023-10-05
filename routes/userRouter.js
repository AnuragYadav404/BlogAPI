const express = require("express");
const router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.json({
    msg: "This returns a list of users on the website",
  });
});

router.post("/signup", function (req, res, next) {
  res.json({
    msg: "This creates a new user account",
  });
});

router.post("/login", function (req, res, next) {
  res.json({
    msg: "This logs in a user account",
  });
});

router.get("/:userID", function (req, res, next) {
  res.json({
    msg: "This returns a particular user information",
  });
});

router.put("/:userID", function (req, res, next) {
  res.json({
    msg: "This updates a particular user information",
  });
});

router.delete("/:userID", function (req, res, next) {
  res.json({
    msg: "This deletes a particular user information",
  });
});

module.exports = router;
