const { Permissions } = require('discord.js');
const { renderTemplate, capitalizeFirst, capitalizeAll } = require('../util/funcs');
const _ = require('lodash');


const guilds = require('express').Router();
const { client } = require(`${process.cwd()}/index`);
const Guild = require(`${process.cwd()}/schemas/Guild`);
const users = require('./users');
const { toUpper, upperCase } = require('lodash');

guilds.post('/get', async (req, res) => {
    let guild = client.guilds.cache.get(req.body.guild);
    if(!guild) {
        return res.status(404).json({ status: 'guild_not_found'}).redirect('/');
    }

    let dbGuild = await Guild.findOne({
        id: guild.id,
    });

    res.json({
        guild: guild,
        database: dbGuild,
        perms: Permissions,
        capL: _.capitalize,
        capA: _.toUpper,
    });
});

guilds.use('/:guildID/user', (req, res, next) => {
    req.guildID = req.params.guildID;
    next();
}, users);

module.exports = guilds;