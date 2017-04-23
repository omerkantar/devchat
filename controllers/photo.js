/**
 * Created by omer on 23.04.2017.
 */



// FRAMEWORKS
var fs = require('fs');
var path = require('path');
var multiparty = require('multiparty');
var multer = require('multer');

var BaseCtrl = require('./base');

module.exports = {

    uploadProfilPhoto: function (req, res) {
        savePhotoWithMulter(req, res, 'profil', function (photoUrl) {
            BaseCtrl.send(res, {"photo_url": BASE_URL(photoUrl) });
        })
    },

    uploadMessagePhoto: function (req, res) {
        savePhotoWithMulter(req, res, 'message', function (photoUrl) {
            BaseCtrl.send(res, {"photo_url": BASE_URL(photoUrl)});
        })
    }
}



function savePhotoWithMulter(req, res, fileName, callback) {

    var pathName = path.join(__dirname + '/../public/data/' + fileName + '/');
    var time = new Date();
    var photoPathName = time.getTime().toString();
    var photoUrl = BASE_URL(req) + fileName + '/';

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, pathName)
        },
        filename: function (req, file, cb) {
            var name = file.originalname;
            if (name) {
                var type = name.split('.');
                var ty = type[type.length-1];
                if (type) {
                    photoPathName += "." + ty;
                }
            }
            photoUrl += photoPathName;
            console.log('photo path name ', photoPathName);

            cb(null, photoPathName)
        }
    });

    var upload = multer({
        desk: pathName,
        inMemory: true,
        storage: storage
    }).single('image');

    upload(req, res, function (err) {
        if (err) {
            console.log("error upload data: ", err);
        }
        console.log("photoUrl :", photoUrl);
        callback(photoUrl);
    });

}

function BASE_URL(req, url) {
    return  req.headers.host + '/static/data/' + url;
}