/**
 * Created by omer on 24.04.2017.
 */


var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PhotoSchema = new Schema({
    type: { type: String, required: false },
    photo_url: { type: String, required: false },
    create_at: { type: Date, default: Date.now }
});

var Photo = mongoose.model('Photo', PhotoSchema);
module.exports = Photo;