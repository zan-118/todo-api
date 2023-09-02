const passport = require("../config/passport");

const authOnly = passport.authenticate("jwt", { session: false });

module.exports = authOnly;
