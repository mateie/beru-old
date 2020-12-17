const { Command } = require('discord.js-commando');

module.exports = class JoinCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'join',
            memberName: 'join',
            description: 'Simulating Join Event',
            group: 'guild',
            ownerOnly: true,
            args: [
                {
                    key: 'member',
                    prompt: 'Simulate who?',
                    type: 'member',
                    default: msg => msg.member,
                }
            ]
        });
    }

    run(message, { member }) {
        this.client.emit('guildMemberAdd', member);
    }
};