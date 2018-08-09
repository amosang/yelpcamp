var Campground = require("../models/campground");
var Comment = require("../models/comment");

// all the middleware goes here
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    // is user logged in?
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                req.flash("error", "Campground not found.");
                res.redirect("back");
            } else {
                // does user own the campground?
                if(foundCampground.author.id.equals(req.user._id)){  // use .equals(), because comparing a mongoose object with a string!
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that.");
                    res.redirect("back"); 
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");  // redirect back 1 step in the browser.
    }    
};

middlewareObj.checkCommentOwnership = function(req, res, next){
    // is user logged in?
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            } else {
                // does user own the comment?
                if(foundComment.author.id.equals(req.user._id)){  // use .equals(), because comparing a mongoose object with a string!
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that.");
                    res.redirect("back"); 
                }
            }
        });
    } else {    
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");  // redirect back 1 step in the browser.
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    //middleware
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that.");
    res.redirect("/login");
};

module.exports = middlewareObj;