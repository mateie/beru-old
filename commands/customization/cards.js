const { Command } = require('discord.js-commando');
let toHex = require('colornames');

const Guild = require(`${process.cwd()}/schemas/Guild`);
const User = require(`${process.cwd()}/schemas/User`);

module.exports = class CardsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'cards',
            memberName: 'cards',
            description: 'Customize Cards',
            group: 'customization',
            aliases: ['card'],
            args: [
                {
                    key: 'which',
                    prompt: 'Which card do you want to customize?',
                    type: 'string',
                    oneOf: ['guild', 'profile'],
                },
                {
                    key: 'element',
                    prompt: 'What element do you want to customize?',
                    type: 'string',
                },
                {
                    key: 'color',
                    prompt: 'What color do you want it to be?',
                    type: 'string',
                },
            ],
        });
    }

    async run(message, { which, element, color }) {
        switch (which) {
            case 'guild':
                if (message.member.hasPermission('MANAGE_GUILD')) {
                    const guild = await Guild.findOne({
                        id: message.guild.id,
                    });

                    let elem = guild.cardSettings[element];

                    if (!elem) {
                        return message.reply('Element does not exist or it does not belong to Guild card elements');
                    }

                    let hex = toHex(color);

                    if (!hex) {
                        return message.say(`**${color}** does not exist!`);
                    }

                    guild.cardSettings[element] = hex;

                    guild.save();

                    return message.say(`***Guild Card Update***: **${element}** was changed for **${message.guild.name}** to **${color}**`);
                } else {
                    message.reply(`You do not have enough permissions to change **${message.guild.name}** Card`);
                }
                break;
            case 'profile':
                const user = await User.findOne({
                    id: message.member.user.id,
                });

                let elem = user.cardSettings[element];

                if (!elem) {
                    return message.reply('Element does not exist or it does not belong to User card elements');
                }

                let hex = toHex(color);

                if (!hex) {
                    return message.say(`**${color}** does not exist!`);
                }

                user.cardSettings[element] = hex;

                user.save();

                return message.say(`***User Card Update***: **${element}** was changed for **${message.member.user.username}** to **${color}**`);
                break;
        }
    }
};