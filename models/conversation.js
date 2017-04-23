/**
 * Created by omer on 23.04.2017.
 */


var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ConversationSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: false },
    photo_url: { type: String, required: false },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    admins: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
    reject_users: [{type: Schema.Types.ObjectId, ref: 'User'}],
    request_users:  [{type: Schema.Types.ObjectId, ref: 'User'}],
    create_at: { type: Date, default: Date.now }
});

var Conversation = mongoose.model('Conversation', ConversationSchema);
module.exports = Conversation;