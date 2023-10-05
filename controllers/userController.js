const asyncHandler = require("express-async-handler");

// controller to get the list of all the users
exports.get_users = asyncHandler(async function (req, res, next) {
  res.json({
    msg: "This returns a list of users on the website",
  });
});

exports.post_signup_user = asyncHandler(async function (req, res, next) {
  res.json({
    msg: "This creates a new user account",
  });
});

exports.post_login_user = asyncHandler(async function (req, res, next) {
  res.json({
    msg: "This creates a new user account",
  });
});

exports.get_user_byID = asyncHandler(async function (req, res, next) {
  res.json({
    msg: "This returns a particular user information",
  });
});

exports.update_user_byID = asyncHandler(async function (req, res, next) {
  res.json({
    msg: "This updates a particular user information",
  });
});

exports.delete_user_byID = asyncHandler(async function (req, res, next) {
  res.json({
    msg: "This deletes a particular user information",
  });
});
