var bcrypt = require('bcrypt');

function genSalt() {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, function(err, salt) {
      if (err) {
        reject(err);
      } else {
        resolve(salt);
      }
    });
  });
}

// hash the password with the salt
function genHash(password, salt) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, salt, function(err, hash) {
      if (err) {
        reject(err);
      } else {
        resolve(hash);
      }
    });
  });
}

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

    measurement_type_method: { type: DataTypes.STRING },
    measurement_type_if_other: { type: DataTypes.STRING },
  },
  {
    hooks: {
      beforeCreate: function(agency, options) {
        return genSalt()
          .then(salt => genHash(agency.password, salt))
          .then(hash => agency.password = hash);
      }
    },
  });

  Agency.associate = function(models) {
    Agency.hasMany(models.Repo);
  }

  Agency.findById = function(id) {
    return this.find({
      where: { id: id }
    });
  }

  Agency.findByIdSimple = function(id) {
    return this.find({
      where: { id: id },
      raw: true
    });
  }

  Agency.findByEmail = function(email) {
    return this.find({
      where: { email: email }
    });
  }

  Agency.updateProperties = function(id, properties, completion) {
    this.update(properties,
      { where: { id: id }}
    ).then(function (agency) {
      return Agency.findByIdSimple(id, completion);
    }).catch(function(err) {
      completion(err, null);
    });
  }

  Agency.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };

  return Agency;
};
