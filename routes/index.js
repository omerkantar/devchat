var express = require('express');
var router = express.Router();
var PhotoCtrl = require('../controllers/photo');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/all_photos', function(req, res) {
  PhotoCtrl.all(req, res);
});

module.exports = router;
