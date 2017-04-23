
var socketio = require('socket.io');
var ClientCtrl = require('./client');
var MessageCtrl = require('./message');


module.exports = {

    server: function (svr) {
        var io = socketio.listen(svr);
        io.on('connection', function(socket) {

            //data = {conversation_id: id, username: 'foo', message: 'foo', photo_url: 'http//:...'}
            socket.on('message', function(data) {
                //db kayıt işlemi yapılacak
                MessageCtrl.message(data, function (json) {
                    socket.broadcast.emit(json);
                });
            });

            //data = {username: 'foo', status: 'foo'}
            socket.on('status', function (data) {
                ClientCtrl.status(data, function (json) {
                    socket.broadcast.emit(json);
                })
            });


            //data = {usernmae: 'foo', conversation_id: id}
            socket.on('read', function(data){
                MessageCtrl.read(data, function (obj) {
                    socket.broadcast.emit(obj);
                })
            });
            // data = {username: addUser, conversation: me}
            socket.on('add user', function(data) {
                ClientCtrl.addUser(data, function(json) {
                    socket.broadcast.emit(json);
                })
            });
        })
    }

}