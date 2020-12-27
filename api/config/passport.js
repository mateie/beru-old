const DiscordStrategy = require('passport-discord').Strategy;

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