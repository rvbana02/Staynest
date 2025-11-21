// controller/listings.js
const Listing = require("../model/listing.js");
const { cloudinary } = require("../cloudConfig.js");

// INDEX
module.exports.index = async (req, res) => {
    const alllisting = await Listing.find({});
    res.render("listing/index.ejs", { alllisting });
};

// SEARCH
module.exports.searchListing = async (req, res) => {
    const query = req.query.q;
    if (!query) return res.redirect("/listing");

    const conditions = [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { location: { $regex: query, $options: "i" } }
    ];

    if (!isNaN(query)) {
        conditions.push({ price: Number(query) });
    }

    const alllisting = await Listing.find({ $or: conditions });
    res.render("listing/index.ejs", { alllisting, q: query });
};

// NEW FORM
module.exports.rendernewform = (req, res) => {
    res.render("listing/new.ejs");
};

// SHOW LISTING
module.exports.showListing = async (req, res) => {
    let { id } = req.params;

    const listings = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: { path: "author" }
        })
        .populate("owner");

    if (!listings) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listing");
    }

    res.render("listing/show.ejs", { listings });
};

// BOOKING
module.exports.booking = async (req, res) => {
    let { id } = req.params;
    const listings = await Listing.findById(id);

    if (!listings) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listing");
    }

    res.render("listing/book.ejs", { listings });
};

module.exports.booksucess = async (req, res) => {
    req.flash("success", "Booking confirmed!");
    res.redirect(`/listing/${req.params.id}`);
};

// CREATE LISTING (MULTIPLE IMAGES)
module.exports.createlisting = async (req, res) => {
    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;

    newlisting.images = req.files.map(f => ({
        url: f.path,
        filename: f.filename
    }));

    await newlisting.save();
    req.flash("success", "New listing created!");
    res.redirect("/listing");
};

// EDIT FORM
module.exports.rendereditform = async (req, res) => {
    const { id } = req.params;

    const listings = await Listing.findById(id);

    if (!listings) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listing");
    }

    res.render("listing/edit.ejs", { listings });
};

// UPDATE LISTING
module.exports.updatelisting = async (req, res) => {
    const { id } = req.params;

    const listings = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    const newImages = req.files.map(f => ({
        url: f.path,
        filename: f.filename
    }));
    listings.images.push(...newImages);

    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }

        await listings.updateOne({
            $pull: { images: { filename: { $in: req.body.deleteImages } } }
        });
    }

    await listings.save();

    req.flash("success", "Listing updated!");
    res.redirect(`/listing/${id}`);
};

// DELETE LISTING
module.exports.deletelisting = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);

    req.flash("success", "Listing deleted!");
    res.redirect("/listing");
};
