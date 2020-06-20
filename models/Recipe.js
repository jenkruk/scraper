// Header space 

var mongoose = require("mongoose");

// Schema Constructor
var Schema = mongoose.Schema;

// Create new Schema for each Recipe
var recipeSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    link: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        data: Buffer,
        required: true,
    },
    note: [
        {
            type: Schema.Types.ObjectId,
            ref: "Note"
        }
    ]
});

// Create the article model w/ mongoose
var Recipe = mongoose.model("Recipe", recipeSchema);
module.exports = Recipe;