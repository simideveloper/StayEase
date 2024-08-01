const express=require('express');
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const List=require("../models/listing.js")
const {LoggedIn, isOwner}=require('../middlewares.js');
const {validatelisting}=require("../middlewares.js");
const listingController=require("../controller/listing.js");
const multer=require('multer');
const {storage}=require('../cloudConfig.js')
const upload=multer({storage});


//index route
router.route('')
    .get(wrapAsync(listingController.index))
     .post(LoggedIn,
     upload.single('listing[image]'),
    wrapAsync(listingController.addListing));

// new listing adding form 
router.get('/new',LoggedIn,listingController.renderNewForm);
router.get('/filters/:filter',wrapAsync(listingController.filteredListing));
router.post('/country',wrapAsync(listingController.requestedcountrylisting));

router.route('/:id')
    .get(wrapAsync(listingController.showListing))
    .put(LoggedIn,isOwner,upload.single('listing[image]'),validatelisting,wrapAsync(listingController.editListing))
    .delete(LoggedIn,isOwner,wrapAsync(listingController.deleteListing));

//edit form route
router.get('/:id/edit',LoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

module.exports=router;