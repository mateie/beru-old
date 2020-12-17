const { Command } = require('discord.js-commando');

module.exports = class XPCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'xp',
            group: 'econ',
            memberName: 'xp',
            description: 'Give/Take XP',
            guildOnly: true,
            args: [
                {
                    key: 'member',
                    prompt: 'Who will recieve or get their xp taken?',
                    type: 'member',
                    default: msg => msg.member,
                },
                {
                    key: 'option',
                    prompt: 'Do you want to give or take?',
                    type: 'string',
                    oneOf: ['give', 'take'],
                },
                {
                    key: 'amount',
                    prompt: 'How much XP?',
                    type: 'integer',
                },
            ],
            ownerOnly: true,
        });
    }

    async run(message, { option, member, amount }) {
        if (option) {
            if (option == 'give') {
                this.client.beruUsers.giveUserXP(member, amount);
                message.say(`Gave **${amount}** XP to **${member.user.username}**`);
            } else {
                this.client.beruUsers.giveUserXP(member, -Math.abs(amount));
                message.say(`Took away **${amount}** XP from **${member.user.username}**`);
            }
        }
    }
};