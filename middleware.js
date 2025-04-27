
const listing=require("./model/listing.js");
const Review=require("./model/review.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema}=require("./schema.js");
const {reviewSchema}=require("./schema.js");


module.exports.isloggedin=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirecturl=req.originalUrl;
        req.flash("error","you must logged into post your Nest!");
       return res.redirect("/login");
    } 
    next();
};

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirecturl){
        res.locals.redirecturl=req.session.redirecturl;
    }
    next();
};


module.exports.isowner=async(req,res,next)=>{
    let {id} =req.params;
    let listings= await listing.findById(id);
    if(!listings.owner._id.equals(res.locals.currUser._id)){
      req.flash("error","you are not the owner of this Nest");
      return res.redirect(`/listing/${id}`);
    }
    next();
};



module.exports.validatelisting=(req, res, next) =>{

    let { error}=listingSchema.validate(req.body); 
    if(error){
     let errMsg=error.details.map((el)=>el.message).join(",");
     throw new ExpressError(400, errMsg);
    }else{
     next();
    }
 };



module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body); 
   if(error){
    let errMsg=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg);
   }else{
    next();
   }
};


module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id,reviewID} =req.params;
    let review= await Review.findById(reviewID);
    if(!review.author.equals(res.locals.currUser._id)){
      req.flash("error","you did not create this review");
      return res.redirect(`/listing/${id}`);
    }
    next();
};
