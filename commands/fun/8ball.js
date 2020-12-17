const { Command } = require('discord.js-commando');

module.exports = class EightBallCommand extends Command {
    constructor(client) {
        super(client, {
            name: '8ball',
            group: 'fun',
            description: '8Ball',
            memberName: '8ball',
            args: [
                {
                    key: 'text',
                    prompt: 'What\'s your question?',
                    type: 'string',
                },
            ],
        });
    }

    run(message, { text }) {
        let replies = [
            'Maybe.',
            'Certainly not.',
            'I hope so.',
            'Not in your wildest dreams.',
            'There is a good chance.',
            'Quite likely.',
            'I think so.',
            'I hope not.',
            'I hope so.',
            'Never!',
            'Pfft.',
            'Sorry, bucko.',
            'Hell, yes.',
            'Hell to the no.',
            'The future is bleak.',
            'The future is uncertain.',
            'I would rather not say.',
            'Who cares?',
            'Possibly.',
            'Never, ever, ever.',
            'There is a small chance.',
            'Yes!',
            'lol no.',
            'There is a high probability.',
            'What difference does it makes?',
            'Not my problem.',
            'Ask someone else.',
        ];

        let result = Math.floor((Math.random() * replies.length));

        if(!text.includes('?')) {
            text += '?';
        }

        message.say(`:8ball: **${text}**: ${replies[result]}`);
    }
};