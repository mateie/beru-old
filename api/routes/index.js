const router = require('express').Router();
const { Permissions } = require('discord.js');
const { client } = require(`${process.cwd()}/index`);
const { renderTemplate } = require('../util/funcs');
const _ = require('lodash');

router.get('/', (req, res) => {
    let botStatus = client.presence.status,
    botActivity = client.presence.activities[0],
    bgColor;

    switch(botStatus) {
        case 'dnd':
            bgColor = 'danger';
            botStatus = botStatus.toUpperCase();
            break;
        case 'idle':
            bgColor = 'warning';
            botStatus = _.capitalize(botStatus);
            break;
        case 'online':
            bgColor = 'success';
            botStatus = _.capitalize(botStatus);
            break;
        default:
            bgColor = 'black';
            botStatus = _.capitalize(botStatus);
            break;
    }

    let activity;

    if(!botActivity) {
        activity = {
            name: 'Nothing',
            type: 'Doing',
        };
    } else {
        activity = {
            name: botActivity.name,
            type: botActivity.type,
        };
    }

    activity.type = activity.type.toLowerCase();
    activity.type = _.capitalize(activity.type);

    switch(activity.type) {
        case 'Listening':
            activity += ' to';
            break;
    }

    res.json({
        perms: Permissions,
        status: botStatus,
        activity: activity,
        bg: bgColor,
        capL: _.capitalize,
    })
});

module.exports = router;