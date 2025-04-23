const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const Review=require("../model/review.js");
const listing=require("../model/listing.js");
const{validateReview, isloggedin,isReviewAuthor}=require("../middleware.js");

const reviewcontroller=require("../controller/reviews.js");
//reviews
//post route
router.post("/",validateReview,isloggedin,wrapAsync(reviewcontroller.createreview));
    
    //delete review route
    router.delete("/:reviewID",isloggedin,isReviewAuthor,wrapAsync(reviewcontroller.deletereview));


    module.exports=router