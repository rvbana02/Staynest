const User=require("../model/user.js");

module.exports.rendersignupform=(req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signup=async(req,res)=>{
    try{
        let{username,email,password}=req.body;
       const newUser=new User({email,username});
       const registeredUser=await User.register(newUser,password);
       console.log(registeredUser);
       req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
         req.flash("success","welcome to StayNest");
          res.redirect("/listing");
       });
       }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
};


module.exports.renderloginform=(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login=async(req,res)=>{
    req.flash("success","Welcome back to StayNest! ");
    let redirecturl=res.locals.redirecturl ||"/listing";
    res.redirect(redirecturl);
   };


   module.exports.logout=(req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","logout you out!");
        res.redirect("/listing");
    });
};