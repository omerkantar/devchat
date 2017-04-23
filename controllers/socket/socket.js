/**
 * Created by omer on 23.04.2017.
 */



var UserCtrl = require('../user');


module.exports = {

    server: function (svr) {
        var io = require('socket.io')(svr);

        io.on('connection', function(socket) {
            UserCtrl.
            socket.on('disconnect', function(data) {

            });
        })
    }

}