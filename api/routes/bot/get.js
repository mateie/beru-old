const router = require('express').Router();
const { client } = require('../../../index');

router.post('/guild', (req, res) => {
    const { guild } = req.body;

    const botGuild = client.guilds.cache.get(guild);

    res.json({ guild: botGuild });

});

router.post('/user', (req, res) => {
    const { user } = req.body;

    const botUser = client.users.cache.get(user);

    res.json({ user: botUser });
});

router.post('/member', (req, res) => {
    const { guild, member } = req.body;

    const botGuild = client.guilds.cache.get(guild);
    const guildMember = botGuild.mebers.cache.get(member);

    res.json({ guild: botGuild, member: guildMember });
});

module.exports = router;