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
                    var dataErr = BaseCtrl.getResponsaData("dont found users", err);
                    callback(dataErr);
                }else {
                    var dataList = BaseCtrl.getErrorData(users);
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

        User.findOne({username: userParams.username, password: MD5(userParams.password )})
            .exec(function (err, user) {
                if (err || user == null || user == undefined) {
                    BaseCtrl.error(res, "login failure", err);
                } else {
                    BaseCtrl.send(res, obj);
                }
            })

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

    connect: function (data) {
        // username
        // status: busy, online, offline
    },

    disconnect: function (data) {
        // username
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