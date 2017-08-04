'use strict';
var Agency = require('../models/').Agency;

module.exports = {
  up: function (queryInterface, Sequelize) { 
    let agencies = [{
      email: 'codegov@omb.eop.gov',
      password: 'test',
      name: 'Office of Management and Budget',
      acronym: 'OMB',
      logo_url: 'https://cei.org/sites/default/files/OMB-Logo.png'
    }]; 

    return Agency.bulkCreate(agencies, {individualHooks: true});
  },

  down: function (queryInterface, Sequelize) { 

  }
};
