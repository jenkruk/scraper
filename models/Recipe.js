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
    // description: {
    //     type: String,
    //     required: true,
    // },
    link: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        data: Buffer,
        required: true,
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
var Recipe = mongoose.model("Recipe", RecipeSchema);

// Export
module.exports = Recipe;