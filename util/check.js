const Users = require('../schemas/Users');
const Guilds = require('../schemas/Guilds');

module.exports = class Check {
    constructor(client) {
        this.client = client;
    }

    guilds() {
        this.client.guilds.cache.forEach(async guild => {
            const checkGuild = await Guilds.findOne({
                id: guild.id,
            });

            if (!checkGuild) {
                const newGuild = new Guilds({
                    id: guild.id,
                    name: guild.name,
                    owner: guild.ownerID,
                });

                console.info(`Adding Guild to the database (${guild.name} - ${guild.id})`);

                await newGuild.save();
            }
        });
    }

    users() {
        this.client.users.cache.forEach(async user => {
            const checkUser = await Users.findOne({
                id: user.id,
            });

            if (!checkUser && !user.bot) {
                const newUser = new Users({
                    id: user.id,
                    username: user.username,
                });

                console.info(`Adding User to the database (${user.username} - ${user.id})`);

                await newUser.save();
            }
        });
    }
};