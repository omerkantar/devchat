/**
 * Created by omer on 22.04.2017.
 */

var BaseCtrl = require('./base');

var User = BaseCtrl.OBJECTS.User;
var USER_TYPE = BaseCtrl.OBJECTS.TYPES.USER_STATE;

module.exports = {
    login: function (req, res) {
        /*
        *  user: {
        *   username:
        *  }
        * */
        var userParams = req.body.user;

        User.findOne({username: userParams.username})
            .exec(function (err, user) {
                if (err || user == null || user == undefined) {
                    createUser(userParams, function (err, obj) {
                        if (err) {
                            BaseCtrl.error(res, "User create error!", err);
                        }else {
                            BaseCtrl.send(res, obj);
                        }
                    });
                } else {
                    BaseCtrl.send(res, obj);
                }
            })

    },

    logout: function (req, res) {
        // username

        User.findOne({username: req.body.username})
            .exec(function (err, user) {
                if (user) {
                    user.status = USER_TYPE.OFFLINE;
                    user.last_date = Date.now();
                    user.save(function (err)) {
                        BaseCtrl.send(res, user);
                    }
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


function createUser(params, callback) {
    var user = new User();
    user.username = params.username;
    user.name = params.name;
    user.email = params.email;
    user.description = params.description;
    user.photo_url = param.photo_url;
    user.github_url = params.github_url;
    user.save(function (err) {
        if (err) {
            callback(err, null);
        }else {
            callback(null, user);
        }
    })
}