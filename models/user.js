/**
 * Created by omer on 23.04.2017.
 */


var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: { type: String, required: false  },
    username: { type: String, required: true, index: { unique: true } },
    email: { type: String, required: false, index: { unique: true } },
    description: { type: String, required: false },
    photo_url: { type: String, required: false },
    github_url: { type: String, required: false },
    star_messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
    status: { type: String, default: "offline" }, // online, offline, busy
    conversations: [{ type: Schema.Types.ObjectId, ref: 'Conversation'}],
    last_date: { type: Date, required: false },
    access_token: { type: String, required: false },
    create_at: { type: Date, default: Date.now }

});

var User = mongoose.model('User', UserSchema);
module.exports = User;