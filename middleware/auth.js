var passport = require("passport");  
var passportJWT = require("passport-jwt"); 
var JwtStrategy = require('passport-jwt').Strategy;
var Agency =  require('../models/').Agency;
var cfg = require("../config.json");  

var ExtractJwt = passportJWT.ExtractJwt;   

var jwtOptions = {  
  secretOrKey: cfg.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeader()
};

module.exports = function() {
  var strategy = new JwtStrategy(jwtOptions, function(payload, done) {
    Agency.findByIdSimple(payload.id, function(err, agency) {
      if (err) { return done(new Error(err), null); }
      else if (!agency) { return done(new Error("Agency invalid"), null); }
      else {
        return done(null, agency);
      }
    });
  });

  passport.use(strategy);

  return {
    initialize: function() {
      return passport.initialize();
    },
    authenticate: function() {
      return passport.authenticate("jwt", cfg.jwt.session);
    },
    validateToken: function() {
      return passport.authenticate("jwt", { session: false });
    }
  };
};