const express = require("express");
const router = express.Router();
const user_controller = require("../controllers/userController");

/* GET users listing. */
router.get("/", user_controller.get_users);

router.post("/signup", user_controller.post_signup_user);

router.post("/login", user_controller.post_login_user);

router.get("/:userID", user_controller.get_user_byID);

router.put("/:userID", user_controller.update_user_byID);

router.delete("/:userID", user_controller.delete_user_byID);

module.exports = router;
