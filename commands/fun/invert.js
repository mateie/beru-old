const { Command } = require('discord.js-commando');
const DIG = require('discord-image-generation');
const { MessageAttachment } = require('discord.js');

module.exports = class InvertCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'invert',
            memberName: 'invert',
            group: 'fun',
            guildOnly: true,
            description: 'Invert Avatar',
            args: [
                {
                    key: 'mention',
                    prompt: 'Mention a member',
                    default: msg => msg.member,
                    type: 'member',
                },
            ],
        });
    }

    async run(message, { mention }) {
        const avatar = mention.user.displayAvatarURL({ format: 'png', dynamic: true, size: 2048 });
        const img = await new DIG.Invert().getImage(avatar);
        const attachment = new MessageAttachment(img, 'invert.png');

        return message.say(attachment);
    }
};