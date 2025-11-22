// routes/listing.js
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const { isloggedin, isowner, validatelisting } = require("../middleware.js");
const listingcontroller = require("../controller/listings.js");

const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// INDEX + CREATE
router.route("/")
  .get(wrapAsync(listingcontroller.index))
  .post(
    isloggedin,
    upload.array("listing[images]", 10),
    validatelisting,
    wrapAsync(listingcontroller.createlisting)
  );

// NEW
router.get("/new", isloggedin, listingcontroller.rendernewform);

// SEARCH
router.get("/search", wrapAsync(listingcontroller.searchListing));  // FIXED (function must exist)

// PRIVACY
router.get("/privacy", (req, res) => {
  res.render("listing/privacy.ejs");
});

// SHOW + UPDATE + DELETE
router.route("/:id")
  .get(wrapAsync(listingcontroller.showListing))
  .put(
    isloggedin,
    isowner,
    upload.array("listing[images]", 10),
    validatelisting,
    wrapAsync(listingcontroller.updatelisting)
  )
  .delete(isloggedin, isowner, wrapAsync(listingcontroller.deletelisting));

// BOOKING
router.route("/:id/book")
  .get(isloggedin, wrapAsync(listingcontroller.booking))
  .post(wrapAsync(listingcontroller.booksucess));

// EDIT
router.get("/:id/edit", isloggedin, isowner, wrapAsync(listingcontroller.rendereditform));

module.exports = router;
