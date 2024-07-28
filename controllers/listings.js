const Listing = require("../models/listing.js");
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

module.exports.index = async (req, res) => {
    let allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings });
  };

  module.exports.newRoute = async (req, res) => {
    res.render("listings/new.ejs");
  };

  module.exports.editRouteGet =  async (req, res) => {
    let id=req.params.id;
    let foundListing= await Listing.findById(id);
    if(!foundListing.owner._id.equals(req.user._id)){
    req.flash('error', "You need to be the owner of the listing for such Tasks");
    res.redirect('/login');
    }
    if(!foundListing){
        req.flash("error", "The listing you are asking for is already deleted");
        res.redirect("/listings");
   }
   let newurl = foundListing.image.url.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs",{foundListing, newurl});  
    };


    module.exports.editRoutePush= async (req, res) => {
        let id=req.params.id;
        let foundListing= await Listing.findById(id);
        let newListing=req.body;
        Object.assign(foundListing, newListing);
        if(typeof req.file !== "undefined")
        {
          let url= req.file.path;
          let filename =req.file.filename;
          foundListing.image ={url,filename};
        }
        await foundListing.save();  
        req.flash("success","Listing Successfully Edited!!");
        res.redirect("/listings"); 
        };

        module.exports.deleteRoute = async (req, res) => {
            let id=req.params.id;
            let foundListing= await Listing.findById(id);
            if(!foundListing.owner._id.equals(req.user._id)){
              req.flash('error', "You need to be the owner of the listing for such Tasks");
              return res.redirect('/login');
              }
            let deletedListing= await Listing.findByIdAndDelete(id);  // will go on to the delete middleware in listing. 
            req.flash("success","Listing Deleted!!");
            res.redirect("/listings"); 
        };

        module.exports.showRouteGet =async (req, res) => {
            try {
              let id = req.params.id;
              let showListing = await Listing.findById(id)
                .populate({
                  path: 'reviews',
                  populate: {
                    path: 'author'
                  },
                })
                .populate('owner');
          
              if (!showListing) {
                req.flash("error", "The listing you are asking for is already deleted");
                return res.redirect("/listings");
              }
          
              res.render("listings/show.ejs", { showListing });
            } catch (err) {
              console.error(err);
              req.flash("error", "Something went wrong");
              res.redirect("/listings");
            }
          };

          module.exports.createPostRoute =  async (req, res, next) => {
            console.log(req.file);
            const url = req.file.path;
            const filename =req.file.filename;
            const listingData = req.body;
               const listing = new Listing(listingData);
               listing.owner = res.locals.currUser._id; 
               listing.image.url = url;
               listing.image.filename = filename;
               await listing.save();
               req.flash("success","New Listing Created!!");
               res.redirect("/listings")
           };