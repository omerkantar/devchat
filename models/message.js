/**
 * Created by omer on 23.04.2017.
 */


var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var MessageSchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    read_users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    text: { type: String, required: false },
    create_at: { type: Date, default: Date.now }
});

var Message = mongoose.model('Message', MessageSchema);
module.exports = Message;