const List=require("../models/listing.js")
const Review=require("../models/review.js");

module.exports.createReview=async (req,res)=>{
    let list= await List.findById(req.params.id);
    let newreview=new Review(req.body.review);
    newreview.author=req.user._id;
    list.review.push(newreview);
    await newreview.save();
    await list.save();
    req.flash('success','New review added!');
    res.redirect(`/listing/${req.params.id}`);
}

module.exports.deleteReview=async (req,res)=>{
    let {id,reviewid}=req.params;
    await List.findByIdAndUpdate(id,{$pull:{review:reviewid}});
    await Review.findByIdAndDelete(reviewid);
    req.flash('success','review deleted!');
    res.redirect(`/listing/${req.params.id}`);
}