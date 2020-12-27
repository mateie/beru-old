const router = require('express').Router();
const { client } = require('../../../index');
const getRoute = require('./get');

router.post('/self', (req, res) => {
    res.json({ bot: client.user });
})

router.post('/users', (req, res) => {
    res.json({ bot_users: client.users.cache });
})

router.post('/guilds', (req, res) => {
    res.json({ bot_guilds: client.guilds.cache });
});

router.use('/get', getRoute);

module.exports = router;