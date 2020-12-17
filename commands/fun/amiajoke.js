const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class AmICommand extends Command {
    constructor(client) {
        super(client, {
            name: 'amiajoke',
            group: 'fun',
            description: 'Am I A Joke To You?',
            memberName: 'amiajoke',
        });
    }

    run(message) {
        let avatar = message.mentions.users.size ? message.mentions.users.first().avatarURL({ format: 'png', dynamic: true, size: 2048 }) : message.author.avatarURL({ format: 'png', dynamic: true, size: 2048 });
        let img = `https://api.alexflipnote.dev/amiajoke?image=${avatar}`;
        const embed = new MessageEmbed()
        .setImage(img);

        message.say(embed);
    }
};