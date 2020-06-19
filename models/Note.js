
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var NoteSchema = new Schema({
    body: {
        type: String
    },
    article: {
        type: Schema.Types.ObjectId,
        ref: "Recipe"
    }
});

var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;