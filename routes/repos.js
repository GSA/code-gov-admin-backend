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
  if (updateVars.partners) updateVars.partners = JSON.parse(updateVars.partners);

  Repo.updateProperties(updateVars.id, updateVars, function(err, repo) { 
    res.json({repo: repo});
  });
});

router.post("/add-json", auth.validateToken(), function(req, res) {  
  let jsonVal = JSON.parse(req.body.codeJson);

  let orgs = jsonVal;
  if (!Array.isArray(jsonVal)) {
    orgs = [jsonVal];
  }

  let orgCount = orgs.length;
  let allCreationObjects = [];

  for (var i = 0; i < orgCount; i++) {
    const org = orgs[i];
    const version = org.version || '1.0.1';

    let importMap = {};
    if (version === '1.0.1') {
      console.log("Version 1.0.1");
      importMap = {
        'name': 'name',
        'version': 'version',
        'organization': 'organization',
        'license': 'license',
        'openSourceProject': 'open_source',
        'governmentWideReuseProject': 'reusable',
        'tags': 'tags',
        'contact.name': 'contact_name',
        'contact.email': 'contact_email',
        'contact.URL': 'contact_url',
        'contact.phone': 'contact_phone',
        'status': 'status',
        'vcs': 'vcs',
        'repository': 'source_code_url',
        'homepage': 'homepage_url',
        'downloadURL': 'download_url',
        'languages': 'languages',
        'partners': 'partners',
        'exemption': 'exemption',
        'exemptionText': 'exemption_text',
        'updated.lastModified': 'updated_at'
      }
    } else if (version === '2.0.0') {
      console.log("Version 2.0.0");
    }

    console.log(org.agency + ' ' + org.organization + ' v' + org.version);

    
    for (var j = 0; j < org.projects.length; j++) {
      const project = org.projects[j];
      console.log(' - ' + project.name);

      let creationMap = { 'AgencyId': req.user.id };
      for (var key in importMap) {
        let newKey = importMap[key];
        try {
          let newVal = eval('project.' + key);
          if ((newKey === 'partners' || newKey === 'tags' || newKey === 'languages') && newVal) {

            // "["grants","contracts","human capital","performance","administration",{"id":6,"text":"sdf"}]"
            console.log("tags: " + JSON.stringify(newVal));
            newVal = JSON.parse(JSON.stringify(newVal));
            console.log("tags2: " + newVal);
            console.log("tags3: " + JSON.stringify(newVal));
          }
          creationMap[newKey] = newVal;
        } catch(err) { }
      }

      allCreationObjects.push(creationMap);
    }
  }

  Repo.bulkCreate(allCreationObjects).then(function(repos) {
    res.json({orgCount: orgCount});
  }); 
});



module.exports = router;
