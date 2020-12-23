const Strategy = require('passport-discord').Strategy;

module.exports = function(passport) {
    passport.use(new Strategy({
        clientID: process.env.BOT_ID,
        clientSecret: process.env.BOT_SECRET,
        callbackURL: `${process.env.DOMAIN}/callback`,
        scope: ['identify', 'guilds'],
    }, (accessToken, refreshToken, profile, done) => {
        process.nextTick(() => done(null, profile));
    }));

    passport.serializeUser((user, done) => done(null, user));
    passport.deserializeUser((obj, done) => done(null, obj));
}