const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('pages/index', {title: 'Home page'});
});

const home = require('../controllers/index');
const login = require('../controllers/login');
const admin = require('../controllers/admin');

router.get('/', home.getIndex);
// router.post('/', ctrlHome.sendData);

router.get('/login', login.getLogin);
router.get('/admin', admin.getAdmin);

module.exports = router;
