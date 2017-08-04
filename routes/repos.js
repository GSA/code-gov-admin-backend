var express = require('express');
var router = express.Router();
var Repo = require('../models').Repo;
var auth = require("../middleware/auth")();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({ text: 'All repos listing'});
});

router.post("/add", auth.validateToken(), function(req, res) {  
  Repo.create({ 
    name: 'New Repo',
    AgencyId: req.user.id
  }).then(function(repo) {
    res.json({repo: repo});
  }); 
});

router.post("/delete", auth.validateToken(), function(req, res) {  
  Repo.destroy({ 
    where: { id: req.body.id }
  }).then(function() {
    res.json({reponse: 'success'});
  }); 
});

router.get('/raw/:repo', auth.validateToken(), function(req, res, next) {
  Repo.findByIdSimple(req.params.repo, function(err, repo) {
    res.json(repo);
  });
});

router.post("/update", auth.validateToken(), function(req, res) {
  let updateVars = req.body;
  
  if (updateVars.languages) updateVars.languages = JSON.parse(updateVars.languages);  
  if (updateVars.tags) updateVars.tags = JSON.parse(updateVars.tags);

  Repo.updateProperties(updateVars.id, updateVars, function(err, repo) { 
    res.json({repo: repo});
  });
});


module.exports = router;
