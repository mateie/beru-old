const { Command } = require('discord.js-commando');
const axios = require('axios');
const { MessageEmbed } = require('discord.js');

module.exports = class SpankCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'spank',
            group: 'nsfw',
            memberName: 'spank',
            description: 'Spank somebody',
            args: [
                {
                    key: 'mention',
                    prompt: 'Who do you want to spank?',
                    type: 'member',
                },
            ],
            nsfw: true,
        });
    }

    async run(message, { mention }) {
        const gif = await axios.get('https://nekos.life/api/v2/img/spank');

        const embed = new MessageEmbed()
        .setTitle(`${message.author.username} spanked ${mention.user.username}`)
        .setImage(gif.data.url);

        message.say(embed);
    }
};