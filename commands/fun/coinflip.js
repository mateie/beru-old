const { Command } = require('discord.js-commando');

module.exports = class CoinflipCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'coinflip',
            group: 'fun',
            memberName: 'coinflip',
            aliases: ['cf'],
            description: 'Heads or Tails',
        });
    }

    run(message) {
        let rand = Math.floor(Math.random() * Math.floor(2));

        let text = ':coin: ';

        if(rand === 0) {
            text += '**Heads**';
        } else {
            text += '**Tails**';
        }

        return message.say(text);
    }
};