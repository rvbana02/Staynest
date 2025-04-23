const express=require("express");
const router=express.Router();
const User=require("../model/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const usercontroller=require("../controller/users.js");

router.route("/signup")
.get(usercontroller.rendersignupform)
.post(wrapAsync(usercontroller.signup));

router.route("/login")
.get(usercontroller.renderloginform)
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect: "/login",failureFlash:true,}),usercontroller.login);

router.get("/logout",usercontroller.logout);


module.exports=router; 