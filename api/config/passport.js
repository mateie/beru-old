const jwt = require('jsonwebtoken');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const DiscordStrategy = require('passport-discord').Strategy;

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_KEY;

module.exports = passport => {
    passport.use(
        new DiscordStrategy({
            clientID: process.env.BOT_ID,
            clientSecret: process.env.BOT_SECRET,
            callbackURL: `/discord/callback`,
            scope: ['identify', 'guilds', 'email']
        }, (accessToken, refreshToken, user, done) => {
            done(null, accessToken);
        })
    );
};