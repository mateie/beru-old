const { FriendlyError } = require('discord.js-commando');
const { client } = require('../index');

client.on('commandError', (cmd, err) => {
    if(err instanceof FriendlyError) {
        console.error(`Error in command ${cmd.groupID}: ${cmd.memberName} ${err}`);
    }
});