/**
 * Created by omer on 23.04.2017.
 */



// FRAMEWORKS
var fs = require('fs');
var path = require('path');
var multiparty = require('multiparty');
var multer = require('multer');

var BaseCtrl = require('./base');
var Photo = BaseCtrl.OBJECTS.Photo;

module.exports = {

    uploadProfilPhoto: function (req, res) {
        savePhotoWithMulter(req, res, 'profil', function (photoUrl) {
            var photo = new Photo();
            photo.photo_url = photoUrl;
            photo.type = 'profil';
            photo.save(function (err) {

            });
            BaseCtrl.send(res, {"photo_url": photoUrl });
        })
    },

    uploadMessagePhoto: function (req, res) {
        savePhotoWithMulter(req, res, 'message', function (photoUrl) {
            var photo = new Photo();
            photo.photo_url = photoUrl;
            photo.type = 'message';
            photo.save(function (err) {

            });

            BaseCtrl.send(res, {"photo_url": photoUrl});
        })
    },

    all: function(req, res) {
        Photo.find({})
            .exec(function(err, all) {
                if (err) {
                    BaseCtrl.error(res, "", err);
                }else {
                    BaseCtrl.send(res, all);
                }
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

function BASE_URL(req) {
    return  req.headers.host + '/static/data/';
}