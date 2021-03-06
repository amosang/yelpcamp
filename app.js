var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    Campground      = require("./models/campground"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    seedDB          = require("./seeds");

// requiring routes.    
var commentRoutes       = require("./routes/comments"),
    campgroundRoutes    = require("./routes/campgrounds"),
    indexRoutes         = require("./routes/index");

var db_url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp_v7" ;  // if env var is empty str, will use the backup string.
mongoose.connect(db_url);
// mongoose.connect("mongodb://localhost/yelp_camp_v7");
//mongoose.connect("mongodb://amos:qwerty1@ds217452.mlab.com:17452/yelpcamp");  // Using mLab's DB instance.

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));  // "__dirname" is the dir in which the script is running.
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();  // seed the database

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Secret Key for Express SESSION!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);  // prefixes all routes from campgroundRoutes with "/campgrounds".
app.use("/campgrounds/:id/comments", commentRoutes);

/* Instantiate server to listen on port */
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("SERVER STARTED - YelpCamp - v11");
});









