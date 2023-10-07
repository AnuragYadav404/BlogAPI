const express = require("express");
const router = express.Router();
const user_controller = require("../controllers/userController");
const passport = require("passport");
const mongoose = require("mongoose");
const article_controller = require("../controllers/articleController");
/* GET users listing. */
router.get("/", user_controller.get_users);

router.get("/isLoggedIn", function (req, res, next) {
  if (req.isAuthenticated) {
    return res.json({
      msg: "Yes the user is logged in",
      user: req.user.username,
    });
  } else {
    return res.json({
      msg: "No user logged in",
    });
  }
});

// this sends back articles related to a particular user

router.post(
  "/signup",
  (req, res, next) => {
    if (req.isAuthenticated()) {
      return res.json({
        msg: "User is already logged in!. Log out ot signup",
      });
    }

    next();
  },
  user_controller.post_signup_user
);

router.get("/loginFail", (req, res, next) => {
  return res.json({
    msg: "Login failed",
  });
});
router.get("/loginSuccess", (req, res, next) => {
  return res.json({
    msg: "Login Success",
  });
});

router.post(
  "/login",
  (req, res, next) => {
    if (req.user) {
      return res.json({
        msg: "You are already logged in!",
      });
    }
    next();
  },
  passport.authenticate("local", {
    failureRedirect: "/users/loginFail",
    successRedirect: "/users/loginSuccess",
  })
);

router.post(
  "/logout",
  (req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    } else {
      return res.json({
        msg: "You must be logged in first to use the log out functionality.",
      });
    }
  },
  user_controller.post_logout_user
);

router.get("/currentUser", function (req, res, next) {
  if (req.isAuthenticated()) {
    return res.json({
      user: req.user,
    });
  } else {
    return res.json({
      msg: "You must be logged in first to get the current user.",
    });
  }
});

router.get(
  "/currentUser/articles",
  function (req, res, next) {
    if (req.isAuthenticated()) {
      req.context = {
        uid: req.user.id,
      };
      next();
    } else {
      return res.json({
        msg: "You must be logged in first to get the user's articles.",
      });
    }
  },
  article_controller.get_articles_by_userID
);

router.get(
  "/:userID",
  function (req, res, next) {
    if (!mongoose.isValidObjectId(req.params.userID)) {
      return res.json({
        msg: "User does not exist",
      });
    }
    req.context = {
      uid: req.params.userID,
    };
    // console.log(req.params.userID);
    next();
  },
  user_controller.get_user_byID
);

// this gets articles related to a particular user
router.get(
  "/:userID/articles",
  function (req, res, next) {
    if (!mongoose.isValidObjectId(req.params.userID)) {
      return res.json({
        msg: "User does not exist",
      });
    }
    req.context = {
      uid: req.params.userID,
    };
    // console.log(req.params.userID);
    next();
  },
  article_controller.get_articles_by_userID
);

// deleting a user can only be possible if the user wants to delete his own account
// first the user must be logged in
// second the user must be deleting his own account only

// delete must only be called on the current user and not using param
router.delete(
  "/delete",
  function (req, res, next) {
    if (req.isAuthenticated()) {
      console.log("user is auth");
      req.context = {
        uid: req.user.id,
      };
      // here first the user must be logged out,
      // then his acc is deleted from user Collection
      req.logout(function (err) {
        if (err) {
          console.log("Error logging out");
          return res.json({
            msg: "User not logged out before deleting",
            err,
          });
        }
      });
      console.log("User logged out successfully");
      next();
    } else {
      console.log("user is auth");
      return res.json({
        msg: "You must be logged in to delete your account!",
      });
    }
  },
  user_controller.delete_user_byID
);

router.put("/:userID", user_controller.update_user_byID);

module.exports = router;
