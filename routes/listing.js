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

//search route
router.get("/search", async (req, res) => {
    const query = req.query.q;
    const alllisting = await listing.find({
        $or: [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
            { location: { $regex: query, $options: "i" } },
            { price: isNaN(query) ? undefined : Number(query) }
        ]
    }).exec();
    res.render("listing/index.ejs", { alllisting, q: query });
  });

  //privacy route
  router.get("/privacy", (req, res) => {
    res.render("listing/privacy.ejs");
});


router.route("/:id")
//show route
.get(wrapAsync(listingcontroller.showListing ))
//update route
.put(isloggedin,isowner,upload.single("listing[Image]"),validatelisting,wrapAsync( listingcontroller.updatelisting))
//delete route
.delete(isloggedin,isowner,wrapAsync( listingcontroller.deletelisting));



//book route
router.route("/:id/book")
.get(isloggedin,wrapAsync(listingcontroller.booking))
.post(wrapAsync(listingcontroller.booksucess));


//edit route
router.get("/:id/edit",isloggedin,isowner, wrapAsync(listingcontroller.rendereditform ));



module.exports=router;