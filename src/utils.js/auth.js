const passport = require("passport");

exports.passportCall = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, function (err, user, info) {
            if (err) return next(err);
            if (!user) {
                return res.status(401).send({ error: "Authentication Error" });
            }
            req.user = user;
            next();
        })(req, res, next);
    };
};

exports.authorization = () => {
    return async (req, res, next) => {
        if (!req.user) return res.status(401).send({ error: "Unauthorized" });
        next();
    };
};
