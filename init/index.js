const mongoose = require("mongoose");
const initdata= require("./data.js");
const listing=require("../model/listing.js");

const mongoose_url="mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
});

async function main() {
    await mongoose.connect(mongoose_url);
}


const initdb = async()=>{
    await listing.deleteMany({});
   initdata.data= initdata.data.map((obj)=>({...obj, owner:"67b9ffa44efdad8ca8360b10"}));
    await listing.insertMany(initdata.data);
    console.log("data intialized");
};


initdb();