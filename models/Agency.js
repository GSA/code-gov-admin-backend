var bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {

  var Agency = sequelize.define("Agency", { 
    email: { type: DataTypes.STRING }, 
    password: { type: DataTypes.STRING },

    name: { type: DataTypes.STRING },
    acronym: { type: DataTypes.STRING },
    logo_url: { type: DataTypes.STRING },
    description: { type: DataTypes.STRING },

    contact_name: { type: DataTypes.STRING },
    contact_email: { type: DataTypes.STRING },
    contact_phone: { type: DataTypes.STRING },
    contact_url: { type: DataTypes.STRING },

    source_code_url: { type: DataTypes.STRING },
    homepage_url: { type: DataTypes.STRING },
  }, 
  { 
    hooks: {
      beforeCreate: function(agency, options, next) {  
        bcrypt.genSalt(10, function(err, salt) {
          bcrypt.hash(agency.password, salt, function(err, hash) {
            agency.password = hash;
            next(null, agency);
          });
        });
      }
    },
    instanceMethods: {
      validPassword: function(password) {
        return bcrypt.compareSync(password, this.password);
      },
    },
    classMethods: {
      test: function() {
        return true
      },  
    }
  });

  Agency.associate = function(models) {
    Agency.hasMany(models.Repo);
  }

  Agency.findById = function(id, completion) {
    this.find({
      where: { id: id }
    }).then(function (agency) {
      completion(null, agency);
    }).catch(function(err) {
      completion(err, null);
    });
  }

  Agency.findByIdSimple = function(id, completion) {
    this.find({
      where: { id: id },
      raw: true
    }).then(function (agency) {
      completion(null, agency);
    }).catch(function(err) {
      completion(err, null);
    });
  }

  Agency.findByEmail = function(email, completion) {
    this.find({
      where: { email: email }
    }).then(function (agency) {
      completion(null, agency);
    }).catch(function(err) {
      completion(err, null);
    });
  }

  Agency.updateProperties = function(id, properties, completion) {
    this.update(properties, 
      { where: { id: id }}
    ).then(function (agency) {
      Agency.findByIdSimple(id, completion); 
    }).catch(function(err) {
      completion(err, null);
    });
  }

  return Agency;
};
