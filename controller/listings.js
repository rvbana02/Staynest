const listing=require("../model/listing.js");


module.exports.index=async(req,res,next)=>{
    const alllisting= await listing.find({});
    res.render("listing/index.ejs",{alllisting});
};

module.exports.rendernewform=(req,res)=>{
    res.render("listing/new.ejs");
    
};


module.exports.showListing=async(req,res,next)=>{
    let {id} =req.params;
    const listings= await listing.findById(id)
    .populate({
        path:"reviews",
        populate:{
            path:"author",
        },
    })
    .populate("owner");
    if(!listings){
        req.flash("error","listing you requested does not exist!");
        res.redirect("/listing");
    }
    console.log(listings);
    res.render("listing/show.ejs",{listings});
    };
   

module.exports.booking=async(req,res)=>{
    let {id} =req.params;
const listings= await listing.findById(id);
if(!listings){
    req.flash("error","listing you requested does not exist!");
    res.redirect("/listing");
}

    res.render("listing/book.ejs",{listings});
}
module.exports.booksucess=async(req,res)=>{
        const { checkIn, checkOut, guests } = req.body;
        // Save booking details logic here (to DB or session)
        req.flash("success", "Booking confirmed!");
        res.redirect(`/listing/${req.params.id}`);
    }


module.exports.createlisting=async(req,res,next)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    const newlisting= new listing(req.body.listing);  
    newlisting.owner=req.user._id;  
    newlisting.Image={url,filename} ; 
    
   await newlisting.save();
   req.flash("success","New listing created!");
   
   res.redirect("/listing");
 };


module.exports.rendereditform =async(req,res,next)=>{
    let {id} =req.params;
const listings= await listing.findById(id);
if(!listings){
    req.flash("error","listing you requested does not exist!");
    res.redirect("/listing");
}

let originalImageUrl=listings.Image.url;
originalImageUrl=originalImageUrl.replace("/upload","/upload/h_300,w_250");
res.render("listing/edit.ejs",{listings,originalImageUrl});
};



module.exports.updatelisting=async(req,res,next)=>{
    let {id} =req.params;
    
  let Listing= await listing.findByIdAndUpdate(id,{...req.body.listing});
  if(typeof req.file != "undefined"){
  let url=req.file.path;
    let filename=req.file.filename;
Listing.Image={url,filename};
await Listing.save();
  }
   req.flash("success","listing updated!");
   res.redirect(`/listing/${id}`);
};


module.exports.deletelisting=async(req,res,next)=>{
    let {id} =req.params;
    let deletedlist =await listing.findByIdAndDelete(id);
    console.log(deletedlist);
    req.flash("success"," listing deleted!");
    res.redirect("/listing");
};