const mongoose=require("mongoose");
const initdata=require("./data.js");
const List=require("../models/listing.js");

const MONGO_URL="mongodb://127.0.0.1:27017/stayease";
async function main(){
    await mongoose.connect(MONGO_URL);
}
main().then(()=>{
    console.log("connected successfully");
}
).catch(err=>{
    console.log(err);
})

const initDB= async ()=>{
    await List.deleteMany({});
    initdata.data=initdata.data.map((ele)=>{return {...ele ,owner:'66a5e81ce2f7a26ebce8eb94'}});
    await List.insertMany(initdata.data);
}

initDB().then(()=>{
    console.log("database initialized successfully");
})
 