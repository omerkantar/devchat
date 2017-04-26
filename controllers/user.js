/**
 * Created by omer on 22.04.2017.
 */

var BaseCtrl = require('./base');
var MD5 = require('MD5');
var User = BaseCtrl.OBJECTS.User;
var USER_TYPE = BaseCtrl.OBJECTS.TYPES.USER_STATE;

module.exports = {
    all: function (callback) {
        User.find({})
            .exec(function (err, users) {
                if (err) {
                    var dataErr = BaseCtrl.getErrorData("dont found users", err);
                    callback(dataErr);
                }else {
                    var list = new Array();
                    for (var i = 0; i < users.length; i++) {
                        var obj = getOtherUserDetail(users[i]);
                        list.push(obj);
                    }
                    var dataList = BaseCtrl.getResponsaData(list);
                    callback(dataList);
                }
            })
    },
    login: function (req, res) {
        /*
        *  user: {
        *   username:
        *   password:
        *  }
        * */
        var userParams = req.body.user;
        if (userParams.username == undefined || userParams.password == undefined) {
            BaseCtrl.error(res, "Bad request", null);
            return;
        }
        try {

            User.findOne({username: userParams.username, password: MD5(userParams.password)})
                .exec(function (err, user) {
                    if (err || user == null || user == undefined) {
                        BaseCtrl.error(res, "login failure", err);
                    } else {
                        BaseCtrl.send(res, user);
                    }
                })

        }catch (e) {
            BaseCtrl.error(res, "login failure", e);
        }


    },

    register: function (req, res) {
        var userParams = req.body.user;
        console.log("user", userParams);
        console.log('func ', createUser);

        createUser(userParams, function (err, user) {
            if (err) {
                BaseCtrl.send(res, "", err);
            }else {
                BaseCtrl.send(res, user);
            }
        });
    },

    logout: function (req, res) {
        // username
        User.findOne({username: req.body.username})
            .exec(function (err, user) {
                if (user) {
                    user.status = USER_TYPE.OFFLINE;
                    user.last_date = Date.now();
                    user.save(function (err) {
                        BaseCtrl.send(res, user);
                    });
                }else {
                    BaseCtrl.send(res, err);
                }
            })
    },

    me: function (req, res) {
        var username = req.query.username;
        BaseCtrl.findUserWithUsername(username, function(err, usr) {
            if (err) {
                BaseCtrl.error(res, "error", err);
            }else {
                BaseCtrl.send(res, usr);
            };
        });
    },
    
    detail: function (req, res) {
        // username = req.body.username
        BaseCtrl.findUserWithUsername(req.query.username, function (err, usr) {
            if (err) {
                BaseCtrl.error(res, "error", err);
            }else {
                var data = getOtherUserDetail(usr);
                BaseCtrl.send(res, data);
            };
        });
    }

};


var createUser = function (params, callback) {
    console.log("USER MODEL", User);
    console.log("USER MODEL", params);

    var user = new User();
    user.username = params.username;
    user.name = params.name;
    user.password = MD5(params.password);
    user.email = params.email;
    user.description = params.description;
    user.photo_url = params.photo_url;
    user.github_url = params.github_url;
    console.log("user model", params);

    user.save(function (err) {
        console.log("err", err);
        if (err) {
            callback(err, null);
        }else {
            callback(null, user);
        }
    })
}


function getOtherUserDetail(user) {
    return {
        "username": user.username,
        "name": user.name,
        "description": user.description,
        "photo_url": user.photo_url,
        "github_url": user.github_url,
        "status": user.status,
        "conversation_count": user.conversations.length
    }
}