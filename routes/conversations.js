/**
 * Created by omer on 23.04.2017.
 */


var express = require('express');
var router = express.Router();
var ConversationCtrl = require('../controllers/conversation');
var PhotoCtrl = require('../controllers/photo');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/new', function (req, res) {
    ConversationCtrl.save(req, res);
});

router.get('/all', function (req, res) {
    ConversationCtrl.all(req, res);
});

router.get('/me', function (req, res) {
    ConversationCtrl.me(req, res);
});

router.get('/detail', function (req, res) {
    ConversationCtrl.detail(req, res);
});


router.post('/photo', function (req, res) {
    PhotoCtrl.uploadMessagePhoto(req, res);
});

module.exports = router;
