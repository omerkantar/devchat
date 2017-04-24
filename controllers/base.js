/**
 * Created by omer on 22.04.2017.
 */


module.exports = {
    OBJECTS: require('../models/objectFactory'),
    send: function (res, data) {
        var json = dataJSON(data, true, 200);
        res.status(200).send(json)
    },

    error: function (res, message, err) {
        var data = {
            "message": message,
            "db_error": err
        };
        var json = dataJSON(data, false, 400);
        res.status(400).send(json);
    },

    getResponsaData: function(data) {
        var json = dataJSON(data, true, 200);
        return json;
    },

    getErrorData: function(message, err) {
        var data = {
            "message": message,
            "db_error": err
        };
        var json = dataJSON(data, false, 400);
        return json;
    },

    findUserWithUsername: function (name, callback) {
        var User = this.OBJECTS.User;
        User.findOne({username: name})
            .populate('conversations')
            .populate('star_messages')
            .exec(function(err, usr) {
                callback(err, usr);
            })
    }
}


function dataJSON(obj, isSuccess, status) {
    return {
        data: obj,
        meta: {
            is_array: Array.isArray(obj),
            is_success: isSuccess,
            "status": status
        }
    }
}