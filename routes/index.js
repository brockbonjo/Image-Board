var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require('../models/user');

//  ===========
// AUTH ROUTES
//  ===========

// show register form
router.get("/register", function (req, res) {
    res.render("register");
});
//handle sign up logic
router.post("/register", function (req, res) {
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
router.get("/login", function (req, res) {
    res.render("login");
});
// handling login logic
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/news",
        failureRedirect: "/login"
    }), function (req, res) {
    });

// logic route
router.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/news");
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}
//middleware
router.get("/", function (req, res) {
    res.render("landing");
});

module.exports = router;