// Header space 

var mongoose = require("mongoose");

// Schema Constructor
var Schema = mongoose.Schema;

// Create new Schema for each Recipe
var RecipeSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    link: {
        type: String,
        required: true,
        unique: true
    },
    imageUrl: {
        type: String,
        required: true,
        unique: true
    },
    saved: {
        type: Boolean,
        default: false,
        required: true
    },
    comment: [
        {
            type: Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

// Create the article model w/ mongoose
var Recipes = mongoose.model("Recipes", RecipeSchema);

// Export
module.exports = Recipes; // do we need this if we are using index to export?