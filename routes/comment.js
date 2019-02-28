var express = require("express");
var router = express.Router({mergeParams:true});

var Article = require("../models/article");
var Comment = require("../models/comment");


//comments new
router.get("/new", isLoggedIn,  function (req, res) {
    // find article by id
    Article.findById(req.params.id, function (err, article) {
        console.log(article)
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { article:article });
        }
    })
});

//comments create
router.post("/", isLoggedIn, function (req, res) {
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
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    //save comment
                    article.comments.push(comment);
                    article.save();
                    console.log(comment);
                    res.redirect('/news/' + article._id);
                }
            });
        }
    });
});

//middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;