var express = require("express");
var router = express.Router();
var Article = require("../models/article");
var Comment = require("../models/comment");

router.get("/", function (req, res) {
    // Get all articles from DB
    Article.find({}, function (err, allArticles) {
        if (err) {
            console.log(err);
        } else {
            res.render("news/index", { articles: allArticles });
        }
    });
});

//CREATE - add new article to DB
router.post("/", isLoggedIn, function (req, res) {
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
router.get("/new", isLoggedIn, function (req, res) {
    res.render("news/new");
});

// SHOW - shows more info about one article
router.get("/:id", function (req, res) {
    //find the article with provided ID
    Article.findById(req.params.id).populate("comments").exec(function (err, foundArticle) {
        if (err) {
            console.log(err);
        } else {

            //render show template with that article
            res.render("news/show", { article: foundArticle });
        }
    });
});

//Destroy News Route
router.delete("/:id", function(req,res){
    res.send("You are trying to delete something");
})


//middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;
