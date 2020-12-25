const router = require('express').Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');

router.all('/', passport.authenticate('discord'));

router.all('/callback', passport.authenticate('discord'), (req, res) => {
    const payload = {
        accessToken: req.user
    };

    jwt.sign(
        payload,
        process.env.JWT_KEY,
        {
            expiresIn: 600000
        },
        (err, token) => {
            if (err) {
                console.error(err);
                res.json({ message: 'JWT Sign Failed' });
            }

            res.cookie('discord-user-token', token, { maxAge: 600000 }).redirect('/');
        }
    );
});

module.exports = router;