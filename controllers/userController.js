const asyncHandler = require("express-async-handler");
const user = require("../models/user");
const genPassword = require("../lib/passwordUtils").genPassword;
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");
// controller to get the list of all the users
exports.get_users = asyncHandler(async function (req, res, next) {
  // this presents a list of users
  const users = await user
    .find({})
    .select({
      username: 1,
      isAuthor: 1,
      name: 1,
      doj: 1,
    })
    .exec();
  // const usersWithUrl = users.map((user) => ({
  //   ...user.toObject(),
  //   url: user.url, // Access the virtual 'url' property
  // }));
  return res.json(users);
});

exports.post_signup_user = [
  body("username", "Username must be min 3 characters and max 30 characters")
    .trim()
    .escape()
    .isLength({ min: 3, max: 30 }),
  body(
    "password",
    "password must be min 5 characters long and maximum 16 characters"
  )
    .trim()
    .escape()
    .isLength({ min: 5, max: 16 }),
  body("description", "description must be at max 1000 characters long")
    .trim()
    .escape()
    .isLength({ max: 1000 }),
  asyncHandler(async function (req, res, next) {
    // check for validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        msg: "Field data did not pass validation checks.",
        errors: errors.array(),
        fieldData: {
          username: req.body.username,
          password: req.body.password,
          description: req.body.description,
        },
      });
    }

    // this handler will handle user creation
    // this will also check if the username is in use
    const checkUsername = await user
      .findOne({
        username: req.body.username,
      })
      .exec();
    if (checkUsername) {
      return res.json({
        msg: "This username is already in use",
      });
    } else {
      // console.log("creating user");
      const { salt, hash } = genPassword(req.body.password);
      const newUser = new user({
        username: req.body.username,
        hash: hash,
        salt: salt,
        name: req.body.name,
      });
      if (req.body.description) {
        newUser.description = req.body.description;
      }
      await newUser.save();
      return res.json({
        msg: "user created",
        userID: newUser.id,
        href: newUser.url,
      });
    }
  }),
];

exports.post_login_user = asyncHandler(async function (req, res, next) {
  // this implements post login, this will mostly be implemented
  //  using passport or auth
  // this will never exec basically
});

exports.post_logout_user = asyncHandler(async function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return res.json({
        msg: "Failed to logout",
        err,
      });
    } else {
      return res.json({
        msg: "Logout successfull!",
      });
    }
  });
});

exports.get_user_byID = asyncHandler(async function (req, res, next) {
  // here i first have to check if uid is valid object id or not
  // this is already handled in router
  // if (!mongoose.isValidObjectId(req.context.uid)) {
  //   return res.json({
  //     msg: "User does not exist",
  //   });
  // }
  const userEle = await user
    .findById(req.context.uid)
    .select({
      hash: 0,
      salt: 0,
      __v: 0,
    })
    .exec();
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

// here the req.context.uid is populated using req.user from middleware
exports.delete_user_byID = asyncHandler(async function (req, res, next) {
  // this function just deletes the user based on req.params
  // this does not check anything else
  // maybe it first need to check if the user even exists or not?
  await user.findByIdAndDelete(req.context.uid);
  return res.json({
    msg: "User deleted successfully",
  });
});
