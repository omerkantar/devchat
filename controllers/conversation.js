/**
 * Created by omer on 23.04.2017.
 */

var BaseCtrl = require('./base');
var User = BaseCtrl.OBJECTS.User;
var Conversation = BaseCtrl.OBJECTS.Conversation;

module.exports = {
    me: function (req, res) {
        // username
        var user = req.query.username;
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

        try {
            console.log("conversation save ", con, me);
            BaseCtrl.findUserWithUsername(me, function (err, usr){
                if (err) {
                    BaseCtrl.error(res, "", err);
                }else {
                    createConversation(con, usr, function (err2, conversation) {
                        Conversation.findOne({_id: conversation._id})
                            .populate('members')
                            .exec(function (err, con2) {
                                usersAddConversationId(con2.members, con2._id, function (err3, usrs) {
                                    if (err3) {
                                        BaseCtrl.error(res, "", err3);
                                    }else {
                                        BaseCtrl.send(res, conversation);
                                    }
                                })
                            })


                    });
                };
            });
        }catch (err) {
            BaseCtrl.error(res, "", err);
        }

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
        var name = req.query.username;
        BaseCtrl.findUserWithUsername(name, function (err, usr) {
            if (err) {
                BaseCtrl.error(res, "", err);
            }else {
                Conversation.find({$where: "this.members.length == 2"})
                    .where('members').in([usr._id])
                    .populate('members')
                    .populate('messages')
                    .exec(function (err, list) {
                        if (err) {
                            BaseCtrl.error(res, "", err);
                        }else {
                            BaseCtrl.send(res, list);
                        }
                    });
            }
        })

    },

    detail: function (req, res) {
        // conversation_id
        var con = req.query.conversation_id;

        Conversation.findOne({_id: con})
            .populate('members')
            .populate('messages', 'author')
            .populate('admins')
            .populate('reject_users')
            .populate('invitation_users')
            .exec(function (err, conversation) {
                if (err) {
                    BaseCtrl.error(res, "", err);
                }else {
                    BaseCtrl.send(res, conversation);
                }
            });
    }
};


function createConversation(con, me, callback) {
    // me = User
    // con : members = [usernames]

    var conversation = new Conversation();
    conversation.name = con.name;
    conversation.name = con.name;
    conversation.description = con.description;
    conversation.photo_url = con.photo_url;

    var hasMe = con.members.indexOf(me.username);
    if (hasMe == undefined || hasMe == null || hasMe < 0) {
        con.members.push(me._id);
    }

    getMemberIdsWithUsernames(null, con.members, function (err, list) {
        for (var i = 0; i < list.length; i ++) {
            var usr = list[i];
            conversation.members.push(usr._id);
        }
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
                list.push(user);
                list.splice(0, 1);
                getMemberIdsWithUsernames(list, names, callback);
            }
        })
};

function usersAddConversationId(users, conid, callback) {

    if (users.length == 0) {
        callback (null, users);
        return;
    }
    var first = names[0];

    User.findOne({username: first.username})
        .exec(function (err, user) {
            if (err) {
                callback(err, null);
            }else {
                user.conversations.push((conid));
                user.save(function (err2) {
                    if (err) {
                        callback(err2)
                    }else {
                        users.splice(0, 1);
                        getMemberIdsWithUsernames(users, conid, callback);
                    }
                })

            }
        })
}