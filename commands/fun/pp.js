const { MessageEmbed } = require('discord.js');
const { Command } = require('discord.js-commando');

module.exports = class PPCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'pp',
            group: 'fun',
            memberName: 'pp',
            aliases: ['peepee'],
            description: 'Gives you, your real PP size so endure it',
        });
    }

    run(message) {
        let rand = Math.floor(Math.random() * 10);

        let pp = '8';

        for(let i = 0; i < rand; i++) {
            pp += '=';
        }

        pp += 'D';

        let embed = new MessageEmbed()
        .setTitle(`${message.author.username}'s PP Size`)
        .addField('\u200b', pp);

        return message.say(embed);
    }
};