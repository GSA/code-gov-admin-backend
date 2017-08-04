var express = require('express');
var router = express.Router();
var Agency = require('../models').Agency;
var Repo = require('../models').Repo;
var auth = require("../middleware/auth")();

/* GET agencies listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/repos', auth.validateToken(), function(req, res, next) {
  Repo.reposForUser(req.user.id, function(err, repos) {
    res.json({repos: repos});
  }, true);
})

router.post("/update", auth.validateToken(), function(req, res) {  
  Agency.updateProperties(req.user.id, req.body, function(err, agency) { 
    res.json({agency: agency});
  });
});

module.exports = router;
