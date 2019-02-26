//Require Mongoose
var mongoose = require("mongoose");

//Create schema for News
var articleSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    comments:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Comment"
        }
    ]
});

//Exports News Schema
module.exports = mongoose.model("Article", articleSchema);