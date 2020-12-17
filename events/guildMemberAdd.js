const { client } = require('../index');
const Check = require('../util/check');
const check = new Check(client);
const Cards = require('../util/cards');

const Guilds = require(`${process.cwd()}/schemas/Guilds`);
const Users = require(`${process.cwd()}/schemas/Users`);

client.on('guildMemberAdd', async member => {
    check.users();

    let guild = await Guilds.findOne({
        id: member.guild.id,
    });

    let user = await Users.findOne({
        id: member.id,
    });

    if (guild.toggles.join == true) {
        const card = new Cards(guild, member, user);
        const channel = member.guild.channels.cache.get(guild.channels.join);

        let attachment = await card.createCard('Welcome');

        channel.send(attachment);
    }
});