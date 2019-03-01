var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    Article = require("./models/article"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds"),
    methodOverride = require("method-override");



//requiring routes
var commentRoutes = require("./routes/comment"),
    newsRoutes    = require("./routes/news"),
    indexRoutes    = require("./routes/index");


// require("./config/database");
// mongodb://penguin:penguin1@ds155815.mlab.com:55815/news



mongoose.connect("mongodb://localhost/yelp_camp_v6");
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
// seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Penguins rule",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

app.use(indexRoutes);
app.use("/news", newsRoutes);
app.use("/news/:id/comments",commentRoutes);



const port = 3000;
app.listen(port, () => console.log(`Server started on ${port}!`))