const express=require("express");
const app=express();
const mongoose=require("mongoose");
const List=require("./models/listing.js")
const path=require("path");
const methodOverride=require('method-override');
const MONGO_URL="mongodb://127.0.0.1:27017/stayease";
const ejsmate=require("ejs-mate");



async function main(){
    await mongoose.connect(MONGO_URL);
}
main().then(()=>{
    console.log("connected successfully");
}
).catch(err=>{
    console.log(err);
})

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine('ejs', ejsmate);
app.use(express.static(path.join(__dirname,'public')));

app.listen(8080,()=>{
    console.log("server is listing on port 8080");
});
app.get('/',(req,res)=>{
    res.send('welcome to home page');
})
app.get('/listing/new',(req,res)=>{
    res.render("listing/new.ejs");
})
app.get('/listing/:id',async (req,res)=>{
    const {id}=req.params;
    const list= await List.findById(id);
    res.render("listing/show.ejs",{list});
})
app.get('/listing',async (req,res)=>{
    const alllistings=await List.find({});
    res.render('listing/index.ejs',{alllistings});
})

app.post('/listing',async (req,res)=>{
    const newlist=new List(req.body.listing);
    await newlist.save();
    res.redirect("/listing");
})

app.get('/listing/:id/edit',async (req,res)=>{
    const {id}=req.params;
    const list=await List.findById(id);
    res.render('listing/edit.ejs',{list});

})

app.put('/listing/:id',async(req,res)=>{
    const {id}=req.params;
    const updatedlisting =await List.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listing/${id}`);
})

app.delete('/listing/:id',async (req,res)=>{
    let {id}=req.params;
    await List.findByIdAndDelete(id);
    res.redirect('/listing');
})