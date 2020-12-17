const axios = require('axios');
const { Command } = require('discord.js-commando');

module.exports = class AdviceCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'advice',
            group: 'fun',
            description: 'Gives Advice',
            memberName: 'advice',
            throttling: {
                usages: 1,
                duration: 5,
            },
        });
    }

    async run(message) {
        let advice = await axios.get('http://api.adviceslip.com/advice');

        message.say(advice.data.slip.advice);
    }
};