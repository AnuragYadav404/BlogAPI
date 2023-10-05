const asyncHandler = require("express-async-handler");
const user = require("../models/user");

// controller to get the list of all the users
exports.get_users = asyncHandler(async function (req, res, next) {
  // this presents a list of users
  const users = await user
    .find()
    .select({
      username: 1,
      isAuthor: 1,
      name: 1,
      doj: 1,
      url: 1,
    })
    .exec();
  return res.json(users);
});

exports.post_signup_user = asyncHandler(async function (req, res, next) {
  // this handler will handle user creation
  // this will also check if the username is in use
  const checkUsername = await user
    .find({
      username: req.context.body.username,
    })
    .exec();
  if (checkUsername) {
    return res.json({
      msg: "This username is already in use",
    });
  } else {
    const newUser = new user({
      username: req.context.body.username,
      hash: "hash",
      salt: "salt",
      name: req.context.body.name,
      description: req.context.body.description,
    });
    await newUser.save();
    return res.json({
      msg: "user created",
      href: newUser.url,
    });
  }
});

exports.post_login_user = asyncHandler(async function (req, res, next) {
  // this implements post login, this will mostly be implemented using passport or auth
});

exports.get_user_byID = asyncHandler(async function (req, res, next) {
  const userEle = await user.findById(req.context.uid).exec();
  if (userEle) {
    res.json({
      userEle,
    });
  } else {
    res.json({
      msg: "User does not exist",
    });
  }
});

// will leave out the update stuff
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
