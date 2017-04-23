/**
 * Created by omer on 23.04.2017.
 */

var BaseCtrl = require('./base');
var User = BaseCtrl.OBJECTS.User;
var Conversation = BaseCtrl.OBJECTS.Conversation;

module.exports = {
    me: function (req, res) {
        // username

        var user = req.body.username;
        BaseCtrl.findUserWithUsername(user, function (err, usr) {
            if (err) {
                BaseCtrl.error(res, "", err);
            }else {
                BaseCtrl.send(res, usr.conversations);
            }
        })
    },

    save: function (req, res) {
        // username:
        // conversation: {
        // name, description, photo_url, members}
        var con = req.body.conversation;
        var me = req.body.username;

        BaseCtrl.findUserWithUsername(me, function (err, usr){
            if (err) {
                BaseCtrl.error(res, "", err);
            }else {
                createConversation(con, usr, function (err2, conversation) {
                    if (err2) {
                        BaseCtrl.error(res, "", err2);

                    }else {
                        BaseCtrl.send(res, conversation);
                    }
                });
            };
        })
    },

    all: function (req, res) {

        Conversation.find({})
            .populate('members')
            .populate('messages')
            .exec(function (err, list) {
                if (err) {
                    BaseCtrl.error(res, "", err);

                }else {
                    BaseCtrl.send(res, list);
                }
            });
    },

    groups: function (req, res) {
        Conversation.find({ $where: "this.members.length > 2"})
            .populate('members')
            .populate('messages')
            .exec(function (err, list) {
                if (err) {
                    BaseCtrl.error(res, "", err);
                }else {
                    BaseCtrl.send(res, list);
                }
            });
    },

    chats: function (req, res) {
        Conversation.find({$where: "this.members.length == 2"})
            .populate('members')
            .populate('messages')
            .exec(function (err, list) {
                if (err) {
                    BaseCtrl.error(res, "", err);
                }else {
                    BaseCtrl.send(res, list);
                }
            });
    },

    detail: function (req, res) {
        // conversation_id

        var con = req.body.conversation_id;

        Conversation.findOne({_id: con})
            .populate('members')
            .populate('messages')
            .populate('admins')
            .populate('reject_users')
            .populate('invitation_users')
            .exec(function (err, conversation) {
                if (err) {
                    BaseCtrl.error(res, "", err);
                }else {
                    BaseCtrl.send(res, conversation);
                }
            })


    }
}


function createConversation(con, me, callback) {
    // me = User
    // con : members = [usernames]
    var conversation = new Conversation();
    conversation.name = con.name;
    conversation.description = con.description;
    conversation.photo_url = con.photo_url;

    getMemberIdsWithUsernames(null, con.members, function (err, list) {
        conversation.members = list;
        conversation.admins.push(me._id);
        conversation.save(function (err2) {
            callback(err2, conversation);
        });
    });

}


function getMemberIdsWithUsernames(list, names, callback) {
    if (list == null || list == undefined) {
        list = new Array();
    }
    if (list.length == 0) {
        callback (null, list);
        return;
    }
    var first = names[0];

    User.findOne({username: first})
        .exec(function (err, user) {
            if (err) {
                callback(err, null);
            }else {
                list.push(user._id);
                list.splice(0, 1);
                getMemberIdsWithUsernames(list, names, callback);
            }
        })
}