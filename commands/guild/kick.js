const { Command } = require('discord.js-commando');

module.exports = class KickCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'kick',
            group: 'guild',
            memberName: 'kick',
            guildOnly: true,
            description: 'Kick Users',
            userPermissions: ['KICK_MEMBERS'],
            clientPermissions: ['KICK_MEMBERS'],
            args: [
                {
                    key: 'member',
                    prompt: 'Who do you want to kick?',
                    type: 'member',
                },
                {
                    key: 'reason',
                    prompt: 'Why do you want to kick them?',
                    type: 'string',
                },
            ],
        });
    }

    run(message, { member, reason }) {
        if(member.id == this.client.user.id) {
            return message.reply('You can not kick me');
        }

        if(member.id == message.author.id) {
            return message.reply('You can not kick yourself');
        }

        if(!member.bannable) {
            return message.reply('They have a higher role than me, I can not kick them');
        }

        reason = reason.length ? reason : 'No reason provided';

        member.kick(`Kicked by ${message.author.tag} for: **${reason}**`)
        .then(() => {
            this.client.users
            .resolve(member.id)
            .send(`You have been kicked from \`${message.guild.name}\` for: \n**${reason}**`)
            .catch(() => void 0);
        })
        .catch(() => {
            message.reply('I could not kick them, please check if I have correct permissions');
        });
    }
};