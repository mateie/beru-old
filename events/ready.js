const { client } = require('../index');
const Check = require('../util/check');
const check = new Check(client);

client.once('ready', () => {
    client.setPresence();

    check.guilds();
    check.users();
    
    console.info(`${client.user.username} has been summoned`);
});