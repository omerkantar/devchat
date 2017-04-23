/**
 * Created by omer on 23.04.2017.
 */


var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ConversationSchema = new Schema({
    name: { type: String, required: false },
    description: { type: String, required: false },
    photo_url: { type: String, required: false },
    members: [{ type: Schema.Types.ObjectId, ref: 'User', required: false }],
    admins: [{ type: Schema.Types.ObjectId, ref: 'User', required: false }],
    messages: [{ type: Schema.Types.ObjectId, ref: 'Message', required: false }],
    reject_users: [{type: Schema.Types.ObjectId, ref: 'User', required: false}],
    invitation_users:  [{type: Schema.Types.ObjectId, ref: 'User', required: false}],
    create_at: { type: Date, default: Date.now }
});

var Conversation = mongoose.model('Conversation', ConversationSchema);
module.exports = Conversation;