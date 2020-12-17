const { Command } = require('discord.js-commando');
const axios = require('axios');
const { MessageEmbed } = require('discord.js');

module.exports = class CuddleCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'cuddle',
            group: 'fun',
            description: 'Cuddle ^^',
            memberName: 'cuddle',
            throttling: {
                usages: 1,
                duration: 5,
            },
            args: [
                {
                    key: 'mention',
                    prompt: 'Please mention a member you want to cuddle?',
                    type: 'member',
                },
            ],
        });
    }

    async run(message, { mention }) {
        const gif = await axios.get('https://nekos.life/api/v2/img/cuddle');

        const embed = new MessageEmbed()
            .setTitle(`${message.author.username} cuddled ${mention.user.username} ^^`)
            .setImage(gif.data.url);

        return message.say(embed);
    }
};