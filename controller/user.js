const User=require('../models/user.js');
module.exports.renderSignUpForm=(req,res)=>{
    res.render('user/signup.ejs');
}

module.exports.SignUp=async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        let newuser=new User({email,username});
        let registereduser=await User.register(newuser,password);
        req.login(registereduser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash('success','Welcome to StayEase!');
            res.redirect('/listing');
        })  
    }catch(err){
        req.flash('error',err.message);
        res.redirect('/signup');
    }
    
};

module.exports.renderLoginForm=(req,res)=>{
    res.render('./user/login.ejs');
};

module.exports.Login=(req,res)=>{
    req.flash('success','Welcome back to StayEase!');
    res.redirect(res.locals.redirectUrl);
};

module.exports.LogOut=(req,res)=>{
    req.logOut((err)=>{
        if(err){
           return next(err);
        }
        req.flash('success','you are logged out!');
        res.redirect('/listing');
    })
};