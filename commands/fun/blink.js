const { Command } = require('discord.js-commando');
const DIG = require('discord-image-generation');
const { MessageAttachment } = require('discord.js');

module.exports = class BlinkCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'blink',
            memberName: 'blink',
            group: 'fun',
            description: 'Switches between images',
            args: [
                {
                    key: 'mention1',
                    prompt: 'Mention first member',
                    default: msg => msg.member,
                    type: 'member',
                },
                {
                    key: 'mention2',
                    prompt: 'Mention second member',
                    type: 'member',
                },
            ],
        });
    }

    async run(message, { mention1, mention2 }) {
        if(!mention2) {
            return message.reply('You did not mention a second member');
        }

        const avatar1 = mention1.user.displayAvatarURL({ format: 'png', dynamic: true, size: 2048 });
        const avatar2 = mention2.user.displayAvatarURL({ format: 'png', dynamic: true, size: 2048 });

        const gif = await new DIG.Blink().getImage(avatar1, avatar2, 500);
        const attachment = new MessageAttachment(gif, 'blink.gif');

        return message.say(attachment);
    }
};