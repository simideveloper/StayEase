const express=require('express');
const router=express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');
const {SaveRedirectUrl } = require('../middlewares.js');
const userController=require('../controller/user.js');


router.route('/signup')
    .get(userController.renderSignUpForm)
    .post(wrapAsync(userController.SignUp));

router.route('/login')
    .get(userController.renderLoginForm)
    .post(SaveRedirectUrl,passport.authenticate('local',
    {failureRedirect:'/login',failureFlash:true}),
    userController.Login
);

router.get('/logout',userController.LogOut);

module.exports=router;