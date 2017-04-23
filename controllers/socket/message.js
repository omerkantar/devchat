/**
 * Created by omer on 23.04.2017.
 */

var BaseCtrl = require('./base');
var User = BaseCtrl.OBJECTS.User;
var Conversation = BaseCtrl.OBJECTS.Conversation;
var Message = BaseCtrl.OBJECTS.Message;

module.exports = {

    message: function (data, callback) {
        //data = {conversation_id: id, username: 'foo', message: 'foo', photo_url: 'http//:...'}

        if (data) {
            if (data["conversation_id"] != undefined && data["conversation_id"] != null) {

                BaseCtrl.findUserWithUsername(data.username, function (err, user) {

                    Conversation.findOne({_id: data.conversation_id})
                        .exec(function (err2, con) {

                            var message = new Message();
                            message.author = user._id;
                            message.text = data.message;
                            message.save(function (err3) {
                                var json;
                                if (err3) {
                                    json =  BaseCtrl.getErrorData("", err3);
                                }else {
                                    var data = { "message": message, "conversation_id": con._id, author_name: user.username };
                                    json = BaseCtrl.getResponsaData(data);
                                    con.messages.push(message);
                                    con.save(function (err) {

                                    })
                                }
                                callback(json);
                            })
                        })
                })

            }else {
                all(callback)
            }
        }else {
            all(callback)
        }
    },

};

