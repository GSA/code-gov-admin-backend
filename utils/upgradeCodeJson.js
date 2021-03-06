
function upgradeOptionalFields(project) {
  project.vcs = project.vcs || '';
  project.disclaimerText = project.disclaimerText || '';
  project.disclaimerURL = project.disclaimerURL || '';
  project.relatedCode = [{
    codeName: '',
    codeURL: '',
    isGovernmentRepo: false,
  }];
  project.reusedCode = [{
    name: '',
    URL: '',
  }];
}

function upgradeToPermissions(project) {
  project.permissions = {};

  project.permissions.licenses = [];

  if (project.license) {
    project.permissions.licenses.push({
      URL: project.license,
      name: null
    });
  } else {
    project.permissions.licenses.push({
      URL: null,
      name: null
    });
  }

  delete project.license;

  if (project.openSourceProject === 1) {
    project.permissions.usageType = 'openSource';
    project.permissions.exemptionText = null;
  } else if (project.governmentWideReuseProject === 1) {
    project.permissions.usageType = 'governmentWideReuse';
    project.permissions.exemptionText = null;
  } else if (String(project.exemption) === '1') {
    project.permissions.usageType = 'exemptByLaw';
    project.permissions.exemptionText = 'The sharing of the source code is restricted by ' +
      'law or regulation, including—but not limited to—patent or intellectual property ' +
      'law, the Export Asset Regulations, the International Traffic in Arms Regulation, ' +
      'and the Federal laws and regulations governing classified information.';
  } else if (String(project.exemption) === '2') {
    project.permissions.usageType = 'exemptByNationalSecurity';
    project.permissions.exemptionText = 'The sharing of the source code would create an ' +
      'identifiable risk to the detriment of national security, confidentiality of ' +
      'Government information, or individual privacy.';
  } else if (String(project.exemption) === '3') {
    project.permissions.usageType = 'exemptByAgencySystem';
    project.permissions.exemptionText = 'The sharing of the source code would create ' +
      'an identifiable risk to the stability, security, or integrity of the agency’s ' +
      'systems or personnel.';
  } else if (String(project.exemption) === '4') {
    project.permissions.usageType = 'exemptByAgencyMission';
    project.permissions.exemptionText = 'The sharing of the source code would create an ' +
      'identifiable risk to agency mission, programs, or operations.';
  } else if (String(project.exemption) === '5') {
    project.permissions.usageType = 'exemptByCIO';
    project.permissions.exemptionText = 'The CIO believes it is in the national interest ' +
      'to exempt sharing the source code.';
  } else {
    project.permissions.usageType = null;
    project.permissions.exemptionText = null;
  }
  delete project.openSourceProject;
  delete project.governmentWideReuseProject;
  delete project.exemption;
  delete project.exemptionText;
}

function upgradeUpdatedToDate(project) {
  project.date = {
    created: '',
    lastModified: '',
    metadataLastUpdated: '',
  };

  if (project.updated) {
    if (project.updated.sourceCodeLastModified) {
      project.date.lastModified = project.updated.sourceCodeLastModified;
    }

    if (project.updated.metadataLastUpdated) {
      project.date.metadataLastUpdated = project.updated.metadataLastUpdated;
    }

    delete project.updated;
  }
}

function upgradeProject(project) {
  project.repositoryURL = project.repository;
  delete project.repository;

  project.homepageURL = project.homepage;
  delete project.homepage;

  upgradeToPermissions(project);

  project.laborHours = null;

  upgradeUpdatedToDate(project);
  upgradeOptionalFields(project);

  return project;
}

module.exports = {
  upgradeProject,
};
