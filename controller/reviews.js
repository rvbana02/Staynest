const listing=require("../model/listing.js");
const Review=require("../model/review.js");

module.exports.createreview=async(req,res)=>{
    let listings=await listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
   listings.reviews.push(newReview);
    
    await newReview.save();
    await listings.save();
    req.flash("success","New review created!");
    res.redirect(`/listing/${listings._id}`);
    };


    module.exports.deletereview=async(req,res)=>{
        let{id, reviewID}=req.params;
        
        await listing.findByIdAndUpdate(id, {$pull: {reviews: reviewID}});
        await Review.findByIdAndDelete(reviewID);
        req.flash("success"," review deleted!");
        res.redirect(`/listing/${id}`);
        };