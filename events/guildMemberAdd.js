const { client } = require('../index');
const Check = require('../util/check');
const check = new Check(client);
const Cards = require('../util/cards');

const Guild = require(`${process.cwd()}/schemas/Guild`);
const User = require(`${process.cwd()}/schemas/User`);

client.on('guildMemberAdd', async member => {
    check.users();

    let guild = await Guild.findOne({
        id: member.guild.id,
    });

    let user = await User.findOne({
        id: member.id,
    });

    if (guild.toggles.join == true) {
        const card = new Cards(guild, member, user);
        const channel = member.guild.channels.cache.get(guild.channels.join);

        let attachment = await card.createCard('Welcome');

        channel.send(attachment);
    }
});