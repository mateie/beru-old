const users = require('express').Router();
const { client } = require(`${process.cwd()}/index`);
const { Permissions } = require('discord.js');
const _ = require('lodash');
const User = require(`${process.cwd()}/schemas/User`);

users.get('/:userID', async (req, res) => {
    const guild = client.guilds.cache.get(req.guildID);
    if (!guild) {
        return res.redirect('/');
    }

    const member = guild.members.cache.get(req.params.userID);
    console.log(member);
    if (!member) {
        return res.redirect('/');
    }

    const xpCard = await client.beruUsers.getXPCard(member);

    let memberStatus = member.presence.status;

    switch (memberStatus) {
        case 'dnd':
            memberStatus = _.toUpper(memberStatus);
            break;
        default:
            memberStatus = _.capitalize(memberStatus);
            break;
    }

    let memberActivity = member.presence.activities[0];
    let activity;

    if (!memberActivity || memberActivity.length < 1) {
        activity = {
            name: '',
            type: 'None',
        };
    } else if (memberActivity.type === 'CUSTOM_STATUS') {
        activity = {
            name: '',
            type: memberActivity.state,
        };
    } else {
        activity = {
            name: memberActivity.name,
            type: memberActivity.type,
        };
    }

    activity.type = activity.type.toLowerCase();
    activity.type = _.capitalize(activity.type);


    switch (activity.type) {
        case 'Listening':
            activity.type += ' to';
            activity.name = memberActivity.details;
            break;
    }

    if (typeof (memberActivity) !== 'undefined') {
        if (typeof (memberActivity.details) !== 'undefined' && memberActivity.details !== null) {
            activity.name += ` On ${memberActivity.name}`;
        }
    }

    res.json({
        perms: Permissions,
        capL: _.capitalize,
        capA: _.toUpper,
        member: member,
        xpCard: Buffer.from(xpCard).toString('base64'),
        status: memberStatus, 
        color: member.displayHexColor, 
        activity: activity, 
        ownerID: process.env.OWNER_ID
    });
});

module.exports = users;