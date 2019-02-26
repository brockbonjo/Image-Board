var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    Article = require("./models/article"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds")

mongoose.connect("mongodb://localhost/yelp_camp_v6");
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
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

app.get("/", function (req, res) {
    res.render("landing");
});

//INDEX - show all articles
app.get("/news", function (req, res) {
    // Get all articles from DB
    Article.find({}, function (err, allArticles) {
        if (err) {
            console.log(err);
        } else {
            res.render("news/index", { articles: allArticles});
        }
    });
});

//CREATE - add new article to DB
app.post("/news", function (req, res) {
    // get data from form and add to article array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newArticle = { name: name, image: image, description: desc }
    // Create a new article and save to DB
    Article.create(newArticle, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            //redirect back to articles page
            res.redirect("/news");
        }
    });
});

//NEW - show form to create new article
app.get("/news/new", function (req, res) {
    res.render("news/new");
});

// SHOW - shows more info about one article
app.get("/news/:id", function (req, res) {
    //find the article with provided ID
    Article.findById(req.params.id).populate("comments").exec(function (err, foundArticle) {
        if (err) {
            console.log(err);
        } else {
            
            //render show template with that article
            res.render("news/show", { article: foundArticle});
        }
    });
});


// ====================
// COMMENTS ROUTES
// ====================

app.get("/news/:id/comments/new", isLoggedIn, function (req, res) {
    // find article by id
    Article.findById(req.params.id, function (err, article) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { article: article });
        }
    })
});

app.post("/news/:id/comments", isLoggedIn, function (req, res) {
    //lookup article using ID
    Article.findById(req.params.id, function (err, article) {
        if (err) {
            console.log(err);
            res.redirect("/news");
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    article.comments.push(comment);
                    article.save();
                    res.redirect('/news/' + article._id);
                }
            });
        }
    });
});


//  ===========
// AUTH ROUTES
//  ===========

// show register form
app.get("/register", function (req, res) {
    res.render("register");
});
//handle sign up logic
app.post("/register", function (req, res) {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render("news");
        }
        passport.authenticate("local")(req, res, function () {
            res.redirect("/news");
        });
    });
});

// show login form
app.get("/login", function (req, res) {
    res.render("login");
});
// handling login logic
app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/news",
        failureRedirect: "/login"
    }), function (req, res) {
    });

// logic route
app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/news");
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

const port = 3000;
app.listen(port, () => console.log(`Yelp camp server started on ${port}!`))