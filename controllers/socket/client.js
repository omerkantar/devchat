/**
 * Created by omer on 23.04.2017.
 */

var BaseCtrl = require('./base');
var User = BaseCtrl.OBJECTS.User;

module.exports = {

    status: function (data, callback) {
        //data = {username: 'foo', status: 'foo'}
        if (data) {
            if (data["status"] != undefined && data["status"] != null) {

                BaseCtrl.findUserWithUsername(data.username, function (err, user) {
                    user.status = data.status;
                    user.save(function (err) {
                        all(callback)
                    })
                })

            }else {
                all(callback)
            }
        }else {
            all(callback)
        }

    }
};

var all = function (callback) {
    User.find({})
        .exec(function (err, list) {
            var json;
            if (err) {
                json =  BaseCtrl.getErrorData("", err);
            }else {
                json = BaseCtrl.getResponsaData(list);
            }
            callback(json);
        });

};