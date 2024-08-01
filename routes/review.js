const express=require('express');
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const {validatereview,LoggedIn, isReviewAuthor}=require("../middlewares.js");
const reviewController=require('../controller/review.js');

// reviews request
router.post('',LoggedIn,validatereview,wrapAsync(reviewController.createReview));

//review delete
router.delete('/:reviewid',LoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview))

module.exports=router;