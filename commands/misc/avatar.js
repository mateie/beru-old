const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class AvatarClass extends Command {
    constructor(client) {
        super(client, {
            name: 'avatar',
            group: 'misc',
            description: 'Get an avatar',
            memberName: 'avatar',
            aliases: ['av', 'pfp'],
            args: [
                {
                    key: 'mention',
                    prompt: 'Who\'s avatar do you want to get',
                    type: 'member',
                    default: msg => msg.member,
                }
            ],
        });
    }

    run(message, { mention }) {
        const avatar = this.client.users.cache.get(mention.user.id).displayAvatarURL({ format: 'png', dynamic: true, size: 2048 });
        
        const embed = new MessageEmbed()
        .setTitle(`${mention.user.username}'s Profile Picture`)
        .setImage(avatar);

        return message.say(embed);
    }
}