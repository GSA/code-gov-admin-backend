var express = require('express');
var router = express.Router();
var jwt = require("jwt-simple");
var cfg = require("../config.json");
var Agency = require('../models').Agency;
var auth = require("../middleware/auth")();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Code.gov Agency Admin Tool API' });
});

router.get('/api-check', function(req, res, next) {
  res.json({ text: 'API Version 0.1'});
});

router.post("/token", function(req, res) {  
  if (req.body.email && req.body.password) {
    var email = req.body.email;
    var password = req.body.password;

    Agency.findByEmail(email, function(err, agency) {
      if (err !== null) {  res.sendStatus(401, 'Err: ' + err); }
      else if (!agency) { res.sendStatus(401, 'No agency'); }
      else if (agency.validPassword(password)) {
        var payload = { id: agency.id };
        var token = jwt.encode(payload, cfg.jwt.secret);

        res.json({ agency: agency, token: token });
      } else {
        res.sendStatus(401, 'Invalid password');
      }
    });
  } else {
    res.sendStatus(401, 'Email and password must be set');
  }
});

router.post("/login-token", auth.validateToken(), function(req, res) { 
  let agency = req.user;
  delete agency.password; 
  res.json({agency: agency});
});

router.get('/token-check', auth.validateToken(), function(req, res, next) {
  res.json('Token valid! Agency id is: ' + req.agency.id + ', email is: ' + req.agency.email + '');
});

module.exports = router;
