const Joi = require('joi');
const review = require("./model/review");
const listing=require("./model/listing");

module.exports.listingSchema=Joi.object({
    listing:Joi.object({
   title:Joi.string().required(),
   description:Joi.string().required(),
    Image:Joi.string().allow("",null),
   price:Joi.number().required().min(0),
  
   location:Joi.string().required(),
   country:Joi.string().required(),
   mapsrc:Joi.string().uri().required(),
}).required()
});

module.exports.reviewSchema=Joi.object({
review:Joi.object({
rating:Joi.number().required().min(1).max(5),
comment:Joi.string().required(),
}).required()

});