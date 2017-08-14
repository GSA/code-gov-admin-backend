'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) { 
    return queryInterface.createTable('Repos', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },

      name: { type: Sequelize.STRING, defaultValue: '' },
      agency: { type: Sequelize.STRING, defaultValue: '' },
      organization: { type: Sequelize.STRING, defaultValue: '' }, 

      description: { type: Sequelize.STRING, defaultValue: '' },
      schema_version: { type: Sequelize.STRING, defaultValue: '' },
      measurement_method: { type: Sequelize.STRING, defaultValue: '' },
      measurement_other_explanation: { type: Sequelize.STRING, defaultValue: '' },
      
      status: { type: Sequelize.STRING, defaultValue: '' },
      license: { type: Sequelize.STRING, defaultValue: '' },
      vcs: { type: Sequelize.STRING, defaultValue: '' },
      reusable: { type: Sequelize.BOOLEAN, defaultValue: false },
      open_source: { type: Sequelize.BOOLEAN, defaultValue: false },

      contact_name: { type: Sequelize.STRING, defaultValue: '' },
      contact_email: { type: Sequelize.STRING, defaultValue: '' },
      contact_phone: { type: Sequelize.STRING, defaultValue: '' },
      contact_url: { type: Sequelize.STRING, defaultValue: '' },

      source_code_url: { type: Sequelize.STRING, defaultValue: '' },
      homepage_url: { type: Sequelize.STRING, defaultValue: '' },
      download_url: { type: Sequelize.STRING, defaultValue: '' },

      exemption: { type: Sequelize.STRING, defaultValue: '' },
      exemption_text: { type: Sequelize.STRING, defaultValue: '' },

      disclaimer_text: { type: Sequelize.STRING, defaultValue: '' },
      disclaimer_url: { type: Sequelize.STRING, defaultValue: '' },

      partners: { type: Sequelize.JSON, defaultValue: [] },
      tags: { type: Sequelize.JSON, defaultValue: [] },
      languages: { type: Sequelize.JSON, defaultValue: [] },

      partners: { type: Sequelize.JSON, defaultValue: [] },
      related_code_bases: { type: Sequelize.JSON, defaultValue: [] },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: Sequelize.DATE,

      AgencyId: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        allowNull: false,
        references: {
          model: 'Agencies',
          key: 'id'
        }
      }

    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('Repos');
  }
};
