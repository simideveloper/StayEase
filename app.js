if(process.env.NODE_ENV!="production"){
    require('dotenv').config()
}
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require('method-override');
const MONGO_URL="mongodb://127.0.0.1:27017/stayease";
const ejsmate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const listing=require('./routes/listing.js');
const review=require('./routes/review.js');
const session=require('express-session');
const flash=require('connect-flash');
const passport=require('passport');
const LocalStartegy=require('passport-local');
const User=require('./models/user.js');
const user=require('./routes/user.js');
async function main(){
    await mongoose.connect(MONGO_URL);
}
main().then(()=>{
    console.log("connected successfully");
}
).catch(err=>{
    console.log(err);
})

const sessionoptions={
    resave:false,
    saveUninitialized: true,
    secret:"mysecretcode",
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
}


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine('ejs', ejsmate);
app.use(express.static(path.join(__dirname,'public')));
app.use(session(sessionoptions));
app.use(flash());

//configuring passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStartegy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.listen(8080,()=>{
    console.log("server is listing on port 8080");
});
app.get('/',(req,res)=>{
    res.send('welcome to home page');
})

app.use((req,res,next)=>{
    res.locals.successmsg=req.flash("success");
    res.locals.errormsg=req.flash("error");
    res.locals.currUser=req.user;
    res.locals.reqcountry=req.session.requestedcountry;
    next();
})

app.use('/listing',listing);
app.use('/listing/:id/reviews',review);
app.use('',user);


app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found!"));
})

//error handling middleware
app.use((err,req,res,next)=>{
    let {statuscode=500,message="something went wrong"}=err;
    console.log(err);
    res.status(statuscode).render('error.ejs',{message});
})