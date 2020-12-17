const { Command } = require('discord.js-commando');
const DIG = require('discord-image-generation');
const { MessageAttachment } = require('discord.js');

const Users = require(`${process.cwd()}/schemas/Users`);

module.exports = class PodiumCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'podium',
            memberName: 'podium',
            description: 'Shows Podium with Leaderboard',
            group: 'econ',
        });
    }

    async run(message) {
        const users = await Users.find().sort({ level: -1 }).limit(3);

        const members = {};

        users.forEach((user, index) => {
            const member = this.client.users.cache.get(user.userID);
            members[index] = {
                username: member.username,
                hashtag: member.discriminator,
                avatar: member.displayAvatarURL({ format: 'png', dynamic: true, size: 2048 }),
            };
        });

        let img = await new DIG.Podium().getImage(members[0].avatar, members[1].avatar, members[2].avatar, `${members[0].username}#${members[0].hashtag}`, `${members[1].username}#${members[1].hashtag}`, `${members[2].username}#${members[2].hashtag}`);
        let attachment = new MessageAttachment(img, 'podium.png');

        return message.say(attachment);

    }
};