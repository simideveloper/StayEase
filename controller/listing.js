const List=require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const maptoken=process.env.MAP_TOKEN;
const geocodingClient= mbxGeocoding({ accessToken: maptoken });
// stylesService exposes listStyles(), createStyle(), getStyle(), etc.

module.exports.index=async (req,res)=>{
    req.session.requestedcountry=undefined;
    res.locals.reqcountry=undefined;
    const alllistings=await List.find({});
    res.render('listing/index.ejs',{alllistings})
};

module.exports.filteredListing=async (req,res)=>{
    let {filter}=req.params;
    if(req.session.requestedcountry){
        const alllistings=await List.find({category:filter,country:req.session.requestedcountry});
        return  res.render('listing/index.ejs',{alllistings});
    }
    const alllistings=await List.find({category:filter});
    res.render('listing/index.ejs',{alllistings});
};

module.exports.renderNewForm=(req,res)=>{
    res.render("listing/new.ejs");
};

module.exports.showListing=async (req,res,next)=>{
    const {id}=req.params;
    const list= await List.findById(id).populate({path:'review',populate:{path:'author',}}).populate('owner');
    if(!list){
        req.flash('error','listing you requested for does not exists');
        res.redirect('/listing');
    }
    res.render("listing/show.ejs",{list});
};

module.exports.addListing=async (req,res)=>{
    let response=await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    }).send()
    console.log();
    let url=req.file.path;
    let filename=req.file.filename;
    const newlist=new List(req.body.listing);
    newlist.owner=req.user._id;
    newlist.image={url,filename};
    newlist.geometry=response.body.features[0].geometry;
    await newlist.save();
    req.flash('success','New listing added');
    res.redirect("/listing");
};

module.exports.renderEditForm=async (req,res)=>{
    const {id}=req.params;
    const list=await List.findById(id);
    let originalurl=list.image.url;
    originalurl=originalurl.replace('/upload','/upload/w_250');
    if(!list){
        req.flash('error','listing you requested for does not exists');
        res.redirect('/listing');
    }
    console.log(originalurl);
    res.render('listing/edit.ejs',{list,originalurl});
}

module.exports.editListing=async(req,res)=>{
    const {id}=req.params;
    let updatedListing=await List.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        updatedListing.image={url,filename};
        updatedListing.save();
    }
    req.flash('success','listing updated!');
    res.redirect(`/listing/${id}`);
};

module.exports.deleteListing=async (req,res)=>{
    let {id}=req.params;
    await List.findByIdAndDelete(id);
    req.flash('success','listing deleted!');
    res.redirect('/listing');
};

module.exports.requestedcountrylisting=async(req,res)=>{
    let requestedcountry=req.body.country;
    req.session.requestedcountry=requestedcountry;
    res.locals.reqcountry=requestedcountry;
    let alllistings= await List.find({country:requestedcountry});
    res.render('listing/index.ejs',{alllistings});
}