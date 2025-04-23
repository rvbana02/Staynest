const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const listing=require("../model/listing.js");
const{isloggedin,isowner,validatelisting}=require("../middleware.js");
const listingcontroller=require("../controller/listings.js");
const multer=require("multer");
const{storage}=require("../cloudConfig.js");
const upload=multer({storage});



router.route("/")
//index route
.get(wrapAsync(listingcontroller.index ))
//create route
.post(isloggedin,upload.single("listing[Image]"),validatelisting,wrapAsync(listingcontroller.createlisting));


//new route
router.get("/new",isloggedin,listingcontroller.rendernewform);


router.route("/:id")
//show route
.get(wrapAsync(listingcontroller.showListing ))
//update route
.put(isloggedin,isowner,upload.single("listing[Image]"),validatelisting,wrapAsync( listingcontroller.updatelisting))
//delete route
.delete(isloggedin,isowner,wrapAsync( listingcontroller.deletelisting));


//edit route
router.get("/:id/edit",isloggedin,isowner, wrapAsync(listingcontroller.rendereditform ));



module.exports=router;