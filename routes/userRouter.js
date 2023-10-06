const express = require("express");
const router = express.Router();
const user_controller = require("../controllers/userController");
const passport = require("passport");

/* GET users listing. */
router.get("/", user_controller.get_users);

router.post(
  "/signup",
  (req, res, next) => {
    if (req.isAuthenticated()) {
      return res.json({
        msg: "User is logged in!",
      });
    } else {
      req.context = {
        dummy: 1,
      };
      req.context.body = req.body;
      next();
    }
  },
  user_controller.post_signup_user
);

router.post(
  "/login",
  function (req, res, next) {
    if (req.isAuthenticated()) {
      return res.json({
        msg: "User is already logged in!",
      });
    }
    next();
  },
  function (req, res, next) {
    //   return res.json({
    //     msg: "Suar",
    //   });
    passport.authenticate("local", function (err, userEle, info) {
      if (err) {
        return res.json({
          msg: "Authentication error occured on server.",
        });
      }
      if (!userEle) {
        return res.json({
          msg: "Wrong authentication details!",
        });
      }
      return res.json({
        msg: "Authentication succeeded",
        userEle,
      });
    })(req, res, next);
  }
);

router.get(
  "/:userID",
  function (req, res, next) {
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
