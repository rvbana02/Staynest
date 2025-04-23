const { types, string } = require("joi");
const mongoose = require("mongoose");
const schema=mongoose.Schema;
const passporLocalMongoose=require("passport-local-mongoose");

const userschema=new schema({
    email:{
        type:String,
        required:true
    }
});


userschema.plugin(passporLocalMongoose);

module.exports=mongoose.model("User",userschema); 