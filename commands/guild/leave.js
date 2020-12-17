const { Command } = require('discord.js-commando');

module.exports = class LeaveCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'leavesim',
            memberName: 'leavesim',
            description: 'Simulating Leave Event',
            group: 'guild',
            ownerOnly: true,
        });
    }

    run(message) {
        this.client.emit('guildMemberRemove', message.member);
    }
};