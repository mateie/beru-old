const { Command } = require('discord.js-commando');
const DIG = require('discord-image-generation');
const { MessageAttachment } = require('discord.js');

module.exports = class PrideCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'pride',
            memberName: 'pride',
            group: 'fun',
            guildOnly: true,
            description: 'Turn avatar into pride image',
            aliases: ['gay'],
            args: [
                {
                    key: 'mention',
                    prompt: 'Who\'s avatar?',
                    default: msg => msg.member,
                    type: 'member',
                },
            ],
        });
    }

    async run(message, { mention }) {
        const avatar = mention.user.displayAvatarURL({ format: 'png', dynamic: true, size: 2048 });
        const img = await new DIG.Gay().getImage(avatar);
        const attachment = new MessageAttachment(img, 'gay.png');

        return message.say(attachment);
    }
};