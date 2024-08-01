const List=require("./models/listing.js");
const wrapAsync = require("./utils/wrapAsync.js");
const {listingSchema,reviewSchema}=require('./schema.js');
const ExpressError=require("./utils/ExpressError.js");
const Review=require("./models/review.js");
module.exports.LoggedIn= (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash('error','you must be logged in!');
        return res.redirect('/login');
    }
    next();
}
module.exports.SaveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    else{
        res.locals.redirectUrl='/listing';
    }
    next();
}

module.exports.isOwner=wrapAsync(async (req,res,next)=>{
    let {id}=req.params;
    let listing=await List.findById(id);
    if(!res.locals.currUser._id.equals(listing.owner)){
        req.flash('error','permission denied');
       return res.redirect(`/listing/${id}`);
    }
    next();
});

module.exports.validatelisting=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errormsg=error.details.map((ele)=>ele.message).join(",");
        throw new ExpressError(400,errormsg);
    }
    else{
        next();
    }
}

module.exports.validatereview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errormsg=error.details.map((ele)=>ele.message).join(",");
        throw new ExpressError(400,errormsg);
    }
    else{
        next();
    }
}

module.exports.isReviewAuthor=wrapAsync(async(req,res,next)=>{
    let {id,reviewid}=req.params;
    let review=await Review.findById(reviewid);
    if(!res.locals.currUser._id.equals(review.author)){
        req.flash('error','permission denied');
       return res.redirect(`/listing/${id}`);
    }
    next();
});