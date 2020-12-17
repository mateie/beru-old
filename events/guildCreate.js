const { client } = require('../index');
const Check = require('../util/check');
const check = new Check(client);

client.on('guildCreate', guild => {
    check.guilds();
});