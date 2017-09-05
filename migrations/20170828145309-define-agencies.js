'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('Agencies', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },

      name: { type: Sequelize.STRING, defaultValue: '' },
      acronym: { type: Sequelize.STRING, defaultValue: '' },
      logo_url: { type: Sequelize.STRING, defaultValue: '' },
      description: { type: Sequelize.STRING, defaultValue: '' },

      contact_name: { type: Sequelize.STRING, defaultValue: '' },
      contact_email: { type: Sequelize.STRING, defaultValue: '' },
      contact_phone: { type: Sequelize.STRING, defaultValue: '' },
      contact_url: { type: Sequelize.STRING, defaultValue: '' },

      measurement_type_method: { type: Sequelize.STRING, defaultValue: '' },
      measurement_type_if_other: { type: Sequelize.STRING, defaultValue: '' },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: Sequelize.DATE
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('Agencies');
  }
};
