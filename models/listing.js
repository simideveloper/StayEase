const mongoose=require('mongoose');
const listschema= new mongoose.Schema({
    title :{
        type:String,
        required:true,
    },
    description:String,
    image:{
        type:String,
        default:"https://images.unsplash.com/photo-1719221203723-1cdcf5605c75?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        set:(v)=>
            (v==="")
            ?"https://images.unsplash.com/photo-1719221203723-1cdcf5605c75?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            :v,
    },
    price:Number,
    location:String,
    country:String,
})
const List=mongoose.model('list',listschema);
module.exports=List;
