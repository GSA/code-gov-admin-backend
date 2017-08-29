var express = require('express');
var router = express.Router();
var Repo = require('../models').Repo;
var auth = require("../middleware/auth")();
const { upgradeProject } = require('../utils/upgradeCodeJson');

/* GET home page. */
router.get('/', function(req, res, next) {
  Repo.all({ plain: true })
    .then((repos) => {
      console.log(repos);

      return {
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
              licenses: [{
                URL: '',
                name: repo.license,
              }],
              usageType: '',
              exemptionText: repo.exemption_text
            },
            laborHours: null,
            tags: JSON.parse(repo.tags).map(tag => tag.text),
            contact: {
              email: repo.contact_email,

              // optional
              name: repo.contact_name,
              URL: repo.contact_url,
              phone: repo.contact_phone,
            },

            // optional
            version: null,
            organization: repo.organization,
            status: repo.status,
            vcs: repo.vcs,
            homepageURL: repo.homepage_url,
            downloadURL: repo.download_url,
            disclaimerText: '',
            disclaimerURL: '',
            languages: JSON.parse(repo.languages).map(language => language.text),
            partners: JSON.parse(repo.partners).map(partner => ({
              name: partner.name,
              email: partner.email,
            })),
            relatedCode: [{
              codeName: '',
              codeURL: '',
              isGovernmentRepo: true,
            }],
            reusedCode: [{
              name: '',
              URL: '',
            }],
            date: {
              created: '',
              lastModified: '',
              metadataLastUpdated: ''
            },
          };
        })
      }
    });

    /*
    { id: 1,
         name: 'GSA Demo',
         organization: 'OFCIO',
         description: 'This is a test',
         status: 'Active',
         license: 'MIT',
         vcs: 'Bitbucket',
         reusable: true,
         open_source: false,
         contact_name: 'Alvand Salehi',
         contact_email: 'alvand@gmail.com',
         contact_phone: '',
         contact_url: '',
         source_code_url: '',
         homepage_url: '',
         download_url: '',
         exemption: '',
         exemption_text: '',
         partners: '[{"name":"Philip Bael","email":"philip@faa.gov"},{"name":"Matt Bailey","email":"matt@omb.gov"}]',
         tags: '[{"id":1,"text":"test"},{"id":2,"text":"demo"},{"id":3,"text":"new"}]',
         languages: '[{"id":1,"text":"java"},{"id":2,"text":"c++"}]',
         createdAt: 2017-08-10T17:26:22.085Z,
         updatedAt: 2017-08-10T17:28:33.080Z,
         AgencyId: 2 },
    */
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

      org.releases = org.projects.map(upgradeProject);
      delete org.projects;
    } else if (version === '2.0.0') {
      console.log("Version 2.0.0");
    }

    allCreationObjects = allCreationObjects.concat(
      org.releases.map(function (release) {
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
          contact_name: release.contact.name,
          contact_email: release.contact.email,
          contact_url: release.contact.URL,
          contact_phone: release.contact.phone,
          partners: release.partners,
          related_code: release.relatedCode,
          reused_code: release.reusedCode,
          usage_type: release.permissions.usageType,
          licenses: release.permissions.licenses,
          exemption_text: release.permissions.exemption_text,
          labor_hours: release.laborHours,
          date_created: release.date.created,
          date_last_modified: release.date.lastModified,
          date_metadata_last_updated: release.date.metadataLastUpdated,
        };
      }));

    console.log(org.agency + ' ' + org.organization + ' v' + org.version);
  }

  Repo.bulkCreate(allCreationObjects).then(function(repos) {
    res.json({orgCount: orgCount});
  });
});



module.exports = router;
