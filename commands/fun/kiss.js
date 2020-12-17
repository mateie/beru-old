const { Command } = require('discord.js-commando');
const axios = require('axios');
const { MessageEmbed } = require('discord.js');

module.exports = class BlinkCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'kiss',
            memberName: 'kiss',
            group: 'fun',
            description: 'Kiss somebody',
            args: [
                {
                    key: 'mention',
                    prompt: 'Mention member',
                    type: 'member',
                },
            ],
        });
    }

    async run(message, { mention }) {

        if(message.author.id == mention.user.id) {
            return message.say('Ok, you narcissist');
        }

        const { data } = await axios.get('https://nekos.life/api/kiss');

        const embed = new MessageEmbed()
        .setTitle(`${message.author.username} kissed ${mention.user.username} :heart:`)
        .setImage(data.url);

        message.say(embed);
    }
};