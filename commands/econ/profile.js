const { MessageAttachment } = require("discord.js");
const { Command } = require('discord.js-commando');

module.exports = class ProfileCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'profile',
            group: 'econ',
            memberName: 'profile',
            description: 'Show XP and rank',
            guildOnly: true,
            aliases: ['pf'],
            args: [
                {
                    key: 'member',
                    prompt: 'Who\'s profile would you like to see?',
                    type: 'member',
                    default: msg => msg.member,
                },
            ],
        });
    }

    async run(message, { member }) {
        if (!member) {
            return message.say('Member doesn\'t exist');
        }

        let card;

        if (message.guild.me.hasPermission('ATTACH_FILES')) {
            message.channel.startTyping();

            const image = await this.client.beruUsers.getXPCard(member);

            card = new MessageAttachment(image, 'rank.png');
        } else {
            card = await this.client.beruUsers.getXPEmbed(member);
        }

        message.say(card);
        message.channel.stopTyping();
    }
};