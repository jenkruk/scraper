
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var noteSchema = new Schema({
    text: {
        type: String,
        required: true,
    }
});

var Note = mongoose.model("Note", noteSchema);

module.exports = Note;