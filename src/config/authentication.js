require('dotenv').config()
const passport = require("passport");
const jwt = require("passport-jwt");

const JwtStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies["token"];
    }
    return token;
};

const initializePassport = () => {
    passport.use('jwt', new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: process.env.JWT_SECRET
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload);
        } catch (err) {
            return done(err);
        }
    }));
};

module.exports = initializePassport;
