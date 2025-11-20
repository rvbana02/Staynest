const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../model/listing.js");
const { isloggedin, isowner, validatelisting } = require("../middleware.js");
const listingcontroller = require("../controller/listings.js");

const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// -------------------------------
// ROUTE: /
// -------------------------------
router.route("/")
  // INDEX ROUTE
  .get(wrapAsync(listingcontroller.index))
  
  // CREATE ROUTE (MULTIPLE IMAGES)
  .post(
    isloggedin, 
    upload.array("listing[images]", 10),   // <-- UPDATED
    validatelisting,
    wrapAsync(listingcontroller.createlisting)
  );

// NEW ROUTE
router.get("/new", isloggedin, listingcontroller.rendernewform);

// SEARCH ROUTE
router.get("/search", async (req, res) => {
  const query = req.query.q;
  const alllisting = await Listing.find({
    $or: [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
      { location: { $regex: query, $options: "i" } },
      { price: isNaN(query) ? undefined : Number(query) }
    ]
  });

  res.render("listing/index.ejs", { alllisting, q: query });
});

// PRIVACY ROUTE
router.get("/privacy", (req, res) => {
  res.render("listing/privacy.ejs");
});

// -------------------------------
// ROUTE: /:id
// -------------------------------
router.route("/:id")
  // SHOW ROUTE
  .get(wrapAsync(listingcontroller.showListing))
  
  // UPDATE ROUTE (MULTIPLE IMAGES + DELETE)
  .put(
    isloggedin,
    isowner,
    upload.array("listing[images]", 10),   // <-- UPDATED
    validatelisting,
    wrapAsync(listingcontroller.updatelisting)
  )

  // DELETE ROUTE
  .delete(isloggedin, isowner, wrapAsync(listingcontroller.deletelisting));

// BOOK ROUTE
router.route("/:id/book")
  .get(isloggedin, wrapAsync(listingcontroller.booking))
  .post(wrapAsync(listingcontroller.booksucess));

// EDIT ROUTE
router.get("/:id/edit", isloggedin, isowner, wrapAsync(listingcontroller.rendereditform));

module.exports = router;
