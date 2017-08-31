var express = require('express');
var router = express.Router();
var Repo = require('../models').Repo;
var auth = require("../middleware/auth")();
const { upgradeProject } = require('../utils/upgradeCodeJson');
const _ = require('lodash');

function parsed(entity) {
  return JSON.parse(entity) || [];
}

/* GET home page. */
router.get('/', function(req, res) {
  Repo.all({ raw: true })
    .then((repos) => {
      res.setHeader('Content-disposition', 'attachment; filename=code.json');
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify({
        version: '2.0.0',
        measurementType: {
          method: '',
        },
        agency: '',
        releases: repos.map(repo => {
          return {
            name: repo.name,
            repositoryURL: repo.repository_url,
            description: repo.description,
            permissions: {
              licenses: parsed(repo.licenses),
              usageType: repo.usage_type,
              exemptionText: repo.exemption_text
            },
            laborHours: repo.labor_hours,
            tags: parsed(repo.tags).map(tag => tag.text),
            contact: {
              email: repo.contact_email,

              // optional
              name: repo.contact_name,
              URL: repo.contact_url,
              phone: repo.contact_phone,
            },

            // optional
            version: repo.version,
            organization: repo.organization,
            status: repo.status,
            vcs: repo.vcs,
            homepageURL: repo.homepage_url,
            downloadURL: repo.download_url,
            disclaimerText: repo.disclaimer_text,
            disclaimerURL: repo.disclaimer_url,
            languages: parsed(repo.languages).map(language => language.text),
            partners: parsed(repo.partners).map(partner => ({
              name: partner.name,
              email: partner.email,
            })),
            relatedCode: parsed(repo.related_code),
            reusedCode: parsed(repo.reused_code),
            date: {
              created: repo.date_created,
              lastModified: repo.date_last_modified,
              metadataLastUpdated: repo.date_metadata_last_updated,
            },
          };
        })
      }));
    });
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

router.get('/raw/:repo', auth.validateToken(), function(req, res) {
  Repo.findByIdSimple(req.params.repo)
    .then(function(repo) {
      res.json(repo);
    });
});

router.post("/update", auth.validateToken(), function(req, res) {
  let updateVars = req.body;

  if (updateVars.languages) updateVars.languages = JSON.parse(updateVars.languages);
  if (updateVars.tags) updateVars.tags = JSON.parse(updateVars.tags);
  if (updateVars.partners) updateVars.partners = JSON.parse(updateVars.partners);
  if (updateVars.licenses) updateVars.licenses = JSON.parse(updateVars.licenses);
  if (updateVars.related_code) updateVars.related_code = JSON.parse(updateVars.related_code);
  if (updateVars.reused_code) updateVars.reused_code = JSON.parse(updateVars.reused_code);

  Repo.updateProperties(updateVars.id, updateVars)
    .then(function(repo) {
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

      if (Array.isArray(org.projects)) {
        org.releases = org.projects.map(upgradeProject);
        delete org.projects;
      }
    } else if (version === '2.0.0') {
      console.log("Version 2.0.0");
    }

    const releases = org.releases || [];

    allCreationObjects = allCreationObjects.concat(
      releases.map(function (release) {
        return {
          AgencyId: req.user.id,
          name: release.name,
          version: release.version,
          description: release.description,
          organization: release.organization,
          status: release.status,
          vcs: release.vcs,
          source_code_url: release.repositoryURL,
          homepage_url: release.homepageURL,
          download_url: release.downloadURL,
          disclaimer_text: release.disclaimerText,
          disclaimer_url: release.disclaimerURL,
          languages: release.languages,
          tags: release.tags,
          contact_name: _.get(release, 'contact.name'),
          contact_email: _.get(release, 'contact.email'),
          contact_url: _.get(release, 'contact.URL'),
          contact_phone: _.get(release, 'contact.phone'),
          partners: release.partners,
          related_code: release.relatedCode,
          reused_code: release.reusedCode,
          usage_type: _.get(release, 'permissions.usageType'),
          licenses: _.get(release, 'permissions.licenses'),
          exemption_text: _.get(release, 'permissions.exemption_text'),
          labor_hours: release.laborHours,
          date_created: _.get(release, 'date.created'),
          date_last_modified: _.get(release, 'date.lastModified'),
          date_metadata_last_updated: _.get(release, 'date.metadataLastUpdated'),
        };
      }));

    console.log(org.agency + ' ' + org.organization + ' v' + org.version);
  }

  Repo.bulkCreate(allCreationObjects).then(function(repos) {
    res.json({orgCount: orgCount});
  });
});



module.exports = router;
