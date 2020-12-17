const { Command } = require('discord.js-commando');
const DIG = require('discord-image-generation');
const { MessageAttachment } = require('discord.js');

module.exports = class JailCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'jail',
            memberName: 'jail',
            group: 'fun',
            guildOnly: true,
            description: 'Jail a person',
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
        const img = await new DIG.Jail().getImage(avatar);
        const attachment = new MessageAttachment(img, 'jail.png');

        return message.say(attachment);
    }
};