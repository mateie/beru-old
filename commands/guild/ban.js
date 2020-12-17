const { Command } = require('discord.js-commando');

module.exports = class BanCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'ban',
            group: 'guild',
            memberName: 'ban',
            description: 'Ban Users',
            userPermissions: ['BAN_MEMBERS'],
            clientPermissions: ['BAN_MEMBERS'],
            guildOnly: true,
            args: [
                {
                    key: 'member',
                    prompt: 'Who do you want to ban?',
                    type: 'member',
                },
                {
                    key: 'reason',
                    prompt: 'Why do you want to ban them?',
                    type: 'string',
                },
                {
                    key: 'days',
                    prompt: 'How many days of their messages do you want to delete? (0-7)',
                    type: 'integer',
                    validate: n => {
                        if(n > -1 && n < 8) {
                            return true;
                        } else {
                            return 'Number should be between 0 and 7!';
                        }
                    },
                },
            ],
        });
    }

    run(message, { member, reason, days }) {
        if(member.id == this.client.user.id) {
            return message.reply('You can not ban me');
        }

        if(member.id == message.author.id) {
            return message.reply('Why would you want to ban yourself?');
        }

        if(!member.bannable) {
            return message.reply('I can not ban them, they have a higher role than me');
        }

        reason = reason.length ? reason : 'No reason provided';

        message.guild.members.ban(member, {
            reason: `Banned by ${message.author.tag} for: **${reason}**`,
            days,
        })
        .then(() => {
            this.client.users.resolve(user.id).send(`You have been banned from \`${message.guild.name}\` for: \n**${reason}**`)
            .catch(() => void 0);

            message.say(`Banned ${member.user.tag} for **${reason}**`);
        })
        .catch(() => {
            message.reply('I could not ban them, please check if I have the correct permissions');
        });
    }
};