var express = require('express');
var router = express.Router();
var Agency = require('../models').Agency;
var Repo = require('../models').Repo;
var auth = require("../middleware/auth")();

router.get('/repos', auth.validateToken(), function(req, res, next) {
  Repo.reposForUser(req.user.id, true)
    .then(function (repos) {
      console.log(repos);
      res.json({ repos });
    });
});

router.post("/update", auth.validateToken(), function(req, res) {
  Agency.updateProperties(req.user.id, req.body)
    .then(function(agency) {
      res.json({ agency });
    });
});

module.exports = router;
