const { client } = require('../index');
const Check = require('../util/check');
const check = new Check(client);
const Cards = require('../util/cards');

const Guild = require(`${process.cwd()}/schemas/Guild`);
const User = require(`${process.cwd()}/schemas/User`);

client.on('guildMemberRemove', async member => {
    check.users();

    let guild = await Guild.findOne({
        id: member.guild.id,
    });

    let user = await User.findOne({
        id: member.id,
    });

    if (guild.toggles.leave == true) {
        const card = new Cards(guild, member, user);
        const channel = member.guild.channels.cache.get(guild.channels.leave);

        let attachment = await card.createCard('Goodbye');

        channel.send(attachment);
    }
});