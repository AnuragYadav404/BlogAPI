const express = require("express");
const router = express.Router();
const user_controller = require("../controllers/userController");
const passport = require("passport");
const mongoose = require("mongoose");
/* GET users listing. */
router.get("/", user_controller.get_users);

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

router.put("/:userID", user_controller.update_user_byID);

router.delete("/:userID", user_controller.delete_user_byID);

module.exports = router;
