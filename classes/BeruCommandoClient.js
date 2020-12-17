const { CommandoClient, CommandoClientOptions } = require('discord.js-commando');
const BeruUsers = require('./BeruUsers');

module.exports = class BeruCommandoClient extends CommandoClient {
    constructor(options) {
        super(options || new CommandoClientOptions());

        this.beruUsers = new BeruUsers(this);
    }

    setPresence() {
        this.user.setPresence({
            activity: {
                name: 'Over Jinwoo',
                type: 'WATCHING',
            },
        });
    }
};