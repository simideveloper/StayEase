const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const Review = require('./review.js');
const listschema= new Schema({
    title :{
        type:String,
        required:true,
    },
    description:String,
    image:{
        url:String,
        filename:String,
    },
    price:Number,
    location:String,
    country:String,
    review:[{
        type:Schema.Types.ObjectId,
        ref:"review"
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    category:{
        type:String,
        enum:["Amazing Pools","Farms","Lakefront","Top of World","Beachfront","Castles","Arctic","HouseBoats","Treehouses","Camping"],
    },
    geometry: {
        type: {
            type: String, 
            enum: ['Point'], 
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
})

listschema.post('findOneAndDelete', async (listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.review}});
    }
})
const List=mongoose.model('list',listschema);
module.exports=List;
