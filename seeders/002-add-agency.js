'use strict';
var Agency = require('../models/').Agency;

module.exports = {
  up: function (queryInterface, Sequelize) { 
    let agencies = [{
      email: 'omb',
      password: 'demo',
      name: 'Office of Management and Budget',
      acronym: 'OMB',
      logo_url: 'https://cei.org/sites/default/files/OMB-Logo.png'
    }, {
      email: 'demo',
      password: 'demo',
      name: 'Demo Agency',
      acronym: 'DEMO',
      logo_url: 'https://cei.org/sites/default/files/OMB-Logo.png'
    }, {
      email: 'gsa',
      password: 'demo',
      name: 'General Services Administration',
      acronym: 'GSA',
      logo_url: 'https://seeklogo.com/images/G/general-services-administration-gsa-logo-33F17F088F-seeklogo.com.png'
    }]; 

    return Agency.bulkCreate(agencies, {individualHooks: true});
  },

  down: function (queryInterface, Sequelize) { 

  }
};
