
module.exports = function(sequelize, DataTypes) {

  var Repo = sequelize.define("Repo", {  

    name: { type: DataTypes.STRING },
    organization: { type: DataTypes.STRING }, 
    description: { type: DataTypes.STRING },

    status: { type: DataTypes.STRING },
    license: { type: DataTypes.STRING },
    vcs: { type: DataTypes.STRING },
    reusable: { type: DataTypes.BOOLEAN },
    open_source: { type: DataTypes.BOOLEAN },

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

  });

  Repo.associate = function(models) { 
    Repo.belongsTo(models.Agency, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false
      }
    });
  }

  Repo.findById = function(id, completion) {
    this.find({
      where: { id: id }
    }).then(function (repo) {
      completion(null, repo);
    }).catch(function(err) {
      completion(err, null);
    });
  }

  Repo.findByIdSimple = function(id, completion) {
    this.find({
      where: { id: id },
      raw: true
    }).then(function (repo) {
      completion(null, repo);
    }).catch(function(err) {
      completion(err, null);
    });
  }

  Repo.reposForUser = function(agencyId, completion, raw) {
    this.findAll({
      where: { AgencyId: agencyId },
      raw: raw
    }).then(function (repos) { 
      completion(null, repos);
    }).catch(function(err) {
      completion(err, null);
    });
  }

  Repo.updateProperties = function(id, properties, completion) {
    this.update(properties, 
      { where: { id: id }}
    ).then(function (repo) {
      Repo.findByIdSimple(id, completion); 
    }).catch(function(err) {
      completion(err, null);
    });
  }

  return Repo;
};
