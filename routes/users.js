var express = require('express');
var router = express.Router();

var UserCtrl = require('../controllers/user');
var PhotoCtrl = require('../controllers/photo');

/* GET users listing. */
router.get('/all', function(req, res, next) {
  UserCtrl.all(function (data) {
    res.send(data);
  })
});

router.get('/me', function (req, res) {
  UserCtrl.me(req, res);
});

router.get('/detail', function (req, res) {
  UserCtrl.detail(req, res);
});

router.post('/register', function(req, res) {
  UserCtrl.register(req, res);
});

router.post('/login', function(req, res) {
  UserCtrl.login(req, res);
});

router.post('/photo', function(req, res) {
  PhotoCtrl.uploadProfilPhoto(req, res);
});

router.post('/logout', function(req, res) {
  User.logout(req, res);
});

module.exports = router;
