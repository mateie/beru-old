const { client } = require('../index');

client.on('message', async message => {
    if (
        message.author.bot ||
        message.channel.type !== "text" ||
        !message.guild.available ||
        message.content.includes(client.commandPrefix)
    ) {
        return;
    }

    await client.beruUsers.giveUserXP(message.member);
});