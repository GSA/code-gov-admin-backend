
module.exports = function(sequelize, DataTypes) {

  var Repo = sequelize.define("Repo", {

    name: { type: DataTypes.STRING },
    organization: { type: DataTypes.STRING },
    description: { type: DataTypes.STRING },
    usage_type: { type: DataTypes.STRING },
    version: { type: DataTypes.STRING },
    labor_hours: { type: DataTypes.INTEGER },

    status: { type: DataTypes.STRING },
    vcs: { type: DataTypes.STRING },
    disclaimer_url: { type: DataTypes.STRING },
    disclaimer_text: { type: DataTypes.STRING },

    contact_name: { type: DataTypes.STRING },
    contact_email: { type: DataTypes.STRING },
    contact_phone: { type: DataTypes.STRING },
    contact_url: { type: DataTypes.STRING },

    source_code_url: { type: DataTypes.STRING },
    homepage_url: { type: DataTypes.STRING },
    download_url: { type: DataTypes.STRING },

    exemption: { type: DataTypes.STRING },
    exemption_text: { type: DataTypes.STRING },

    partners: { type: DataTypes.JSON },
    tags: { type: DataTypes.JSON },
    languages: { type: DataTypes.JSON },
    licenses: { type: DataTypes.JSON },
    related_code: { type: DataTypes.JSON },
    reused_code: { type: DataTypes.JSON },

    date_created: { type: DataTypes.STRING },
    date_last_modified: { type: DataTypes.STRING },
    date_metadata_last_updated: { type: DataTypes.STRING },

  });

  Repo.associate = function(models) {
    Repo.belongsTo(models.Agency, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false
      }
    });
  }

  Repo.findById = function(id) {
    return this.find({
      where: { id: id }
    });
  }

  Repo.findByIdSimple = function(id) {
    return this.find({
      where: { id: id },
      raw: true
    });
  }

  Repo.reposForUser = function(agencyId, raw) {
    return this.findAll({
      where: { AgencyId: agencyId },
      raw: raw
    });
  }

  Repo.updateProperties = function(id, properties) {
    return this.update(properties,
      { where: { id: id }}
    ).then(function (repo) {
      return Repo.findByIdSimple(id);
    });
  }

  return Repo;
};
