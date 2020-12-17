const { Command } = require('discord.js-commando');
const DIG = require('discord-image-generation');
const { MessageAttachment } = require('discord.js');

module.exports = class TriggeredCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'triggered',
            memberName: 'triggered',
            group: 'fun',
            description: 'Triggered Avatar GIF',
            aliases: ['mad'],
            args: [
                {
                    key: 'mention',
                    prompt: 'Mention a member',
                    type: 'member',
                    default: msg => msg.member,
                },
            ],
        });
    }

    async run(message, { mention }) {
        const avatar = mention.user.displayAvatarURL({ format: 'png', dynamic: true, size: 2048 });
        const gif = await new DIG.Triggered().getImage(avatar);

        const attachment = new MessageAttachment(gif, 'triggered.gif');

        return message.say(attachment);
    }
};