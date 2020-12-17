const { MessageEmbed } = require('discord.js');
const { Command } = require('discord.js-commando');

module.exports = class HowGayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'howgay',
            group: 'fun',
            description: 'Determines How Gay You are',
            memberName: 'howgay',
        });
    }

    run(message) {
        let random = Math.floor(Math.random() * 100);

        const embed = new MessageEmbed();

        if (random == 100) {
            embed.setTitle('Do you drop the soap on purpose?');
        } else if (random == 99) {
            embed.setTitle('Atleast not 100% right?');
        } else if (random == 0) {
            embed.setTitle('You\'re a Pure Soul');
        } else if (random == 69) {
            embed.setTitle('Two cocks in different mouths ;)');
        } else {
            embed.setTitle(`Gay Machine - ${message.author.username}`);
        }

        embed.addField('\u200b', `You are ${random}% gay :rainbow_flag:`);

        message.say(embed);
    }
};