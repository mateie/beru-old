const { MessageEmbed } = require('discord.js');
const { Command, CommandDispatcher } = require('discord.js-commando');
const User = require(`${process.cwd()}/schemas/User`);
const { rankEmoji } = require(`${process.cwd()}/util/xp`);

module.exports = class LeaderboardCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'leaderboard',
            memberName: 'leaderboard',
            description: 'Shows User Leaderboard',
            group: 'econ',
            aliases: ['lbd'],
            args: [
                {
                    key: 'amount',
                    prompt: 'What type of leaderboard',
                    type: 'integer',
                    oneOf: [5, 10, 25],
                    default: 10,
                }
            ]
        });
    }

    run(message, { amount }) {
        User.find().sort({ level: -1, xp: -1 }).limit(amount)
        .then(users => {
            const embed = new MessageEmbed()
            .setTitle(`Top ${amount} Leaderboard`);
            users.forEach(user => {
                embed.addField(user.username, `XP: ${user.xp}, Level: ${user.level}`);
            });

            return message.say(embed);
        });
    }
}