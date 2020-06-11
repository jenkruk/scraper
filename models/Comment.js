// Header space 

var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CommentSchema = new Schema({
    comment: {
    type: String
}
});

var Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment; // do we need this if we are using index to export?