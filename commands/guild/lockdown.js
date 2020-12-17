const { Command } = require('discord.js-commando');

module.exports = class LockdownCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'lockdown',
            group: 'guild',
            description: 'Lockdowns a channel',
            memberName: 'lockdown',
            aliases: ['ld'],
            clientPermissions: ['MANAGE_CHANNELS'],
            userPermissions: ['MANAGE_CHANNELS'],
        });
    }

    run(message) {
        const channel = message.channel;

        let permissions = channel.permissionsFor(message.guild.id);

        if(permissions.has('SEND_MESSAGES')) {
            channel.createOverwrite(message.guild.id, {
                SEND_MESSAGES: false,
            });

            return message.say(`${message.author} locked **${channel.name}**`);
        } else {
            channel.createOverwrite(message.guild.id, {
                SEND_MESSAGES: true,
            });
            return message.say(`${message.author} lifted the lock from **${channel.name}**`);
        }
    }
};